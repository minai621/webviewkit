/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { selectBestVersion } from "@/utils/version";
import { getEnvironment } from "@webviewkit/environment";
import { v4 as uuidv4 } from "uuid";
import {
  BridgeConfig,
  BridgeInterface,
  BridgeResponse,
  ErrorHandlers,
  EventResponse,
  IBridge,
  IEventTypes,
  IRequestTypes,
  OS,
  RequestParams,
  SemverVersion,
  VersionedRequest,
  VersionedResponse,
} from "./Bridge.type";
import { TimeoutError } from "./DefaultBridgeError";

class Bridge<T extends IRequestTypes, E extends IEventTypes>
  implements IBridge<T, E>
{
  private eventHandlers: Map<keyof E, Set<(response: any) => void>> = new Map();
  private pendingRequests: Map<
    string,
    // eslint-disable-next-line no-undef
    { resolve: Function; reject: Function; timer: NodeJS.Timeout }
  > = new Map();
  private currentBridge: BridgeInterface;
  private currentVersion: SemverVersion;

  constructor(
    private errorHandlers: ErrorHandlers,
    private config: BridgeConfig
  ) {
    this.currentBridge = this.selectBridge();
    this.currentVersion = config.version;
    this.initMessageListener();
  }

  async request<M extends keyof T>(
    methodName: M,
    requests: VersionedRequest<T, M>[]
  ): Promise<[VersionedResponse<T, M> | null, Error | null]> {
    try {
      const bestVersion = this.selectBestVersion(
        requests.map((r) => r.version) as (keyof T[M] & SemverVersion)[]
      );
      const bestRequest =
        requests.find((r) => r.version === bestVersion) ||
        requests.find((r) => r.version === "default");

      if (!bestRequest) {
        throw new Error(
          `No suitable version found for method ${String(methodName)}`
        );
      }

      const result = await this.sendRequest(
        methodName,
        bestRequest.version,
        bestRequest.params
      );
      return [result, null as Error | null];
    } catch (error: any) {
      if (error instanceof TimeoutError) {
        return [null, error];
      }
      return [null, this.handleError(error)];
    }
  }

  on<K extends keyof E>(
    eventName: K,
    handler: (response: EventResponse<E, K, keyof E[K] & string>) => void
  ): void {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, new Set());
    }
    this.eventHandlers.get(eventName)!.add(handler);
  }

  off<K extends keyof E>(eventName: K): void {
    this.eventHandlers.delete(eventName);
  }

  private selectBridge(): BridgeInterface {
    const os = getEnvironment(navigator.userAgent).os.name as OS;
    return this.config.bridges[os] || this.config.bridges.ReactNative;
  }

  private selectBestVersion(
    availableVersions: (keyof T & string)[]
  ): keyof T & string {
    return selectBestVersion(availableVersions, this.currentVersion);
  }

  private async sendRequest<
    M extends keyof T,
    V extends keyof T[M] & SemverVersion,
  >(
    methodName: M,
    version: V,
    params: RequestParams<T, M, V>
  ): Promise<VersionedResponse<T, M> | null> {
    const requestId = uuidv4();
    const timeoutDuration = this.config.defaultTimeout || 5000;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(
          new TimeoutError(
            `Request timeout for method ${String(methodName)} version ${version}`
          )
        );
      }, timeoutDuration);

      this.pendingRequests.set(requestId, { resolve, reject, timer });

      this.currentBridge.postMessage(
        JSON.stringify({
          id: requestId,
          type: "request",
          method: methodName,
          version,
          params,
        })
      );
    });
  }

  private handleEvent<K extends keyof E>(
    eventName: K,
    version: keyof E[K] & string,
    data: E[K][keyof E[K] & string]
  ): void {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      handlers.forEach((handler) =>
        handler({ version, data } as EventResponse<E, K, keyof E[K] & string>)
      );
    } else {
      console.warn(`No handler found for event: ${String(eventName)}`);
    }
  }

  private initMessageListener(): void {
    window.addEventListener("message", (event) => {
      const response: BridgeResponse = JSON.parse(event.data);
      const { id, type, method, version, payload, error } = response;

      if (type === "response") {
        const pendingRequest = this.pendingRequests.get(id);
        if (pendingRequest) {
          clearTimeout(pendingRequest.timer);
          this.pendingRequests.delete(id);
          if (error) {
            pendingRequest.reject(this.handleError(error));
          } else {
            pendingRequest.resolve({
              version,
              result: payload,
            } as VersionedResponse<T, typeof method>);
          }
        }
      } else if (type === "event") {
        this.handleEvent(method, version, payload);
      }
    });
  }

  private handleError(error: Error | { type: string; message: string }): Error {
    if (error instanceof Error) {
      return error;
    }

    const handler = this.errorHandlers[error.type];
    if (handler) {
      return handler(new Error(error.message));
    } else {
      return this.errorHandlers.default(new Error(error.message));
    }
  }
}

export default Bridge;
