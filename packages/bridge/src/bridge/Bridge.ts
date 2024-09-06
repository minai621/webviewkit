import { findBestHandlerVersion } from "@/utils/version";
import { DefaultBridgeError, DefaultBridgeMessage } from ".";
import {
  HandlerParamsType,
  HandlerReturnType,
  IBridge,
  RequestHandlers,
  ResponseHandlers,
  SemverVersion,
} from "./Bridge.type";

class Bridge<
  TRequestHandlers extends RequestHandlers,
  TResponseHandlers extends ResponseHandlers,
> {
  public version: SemverVersion;
  private config: IBridge<TRequestHandlers, TResponseHandlers>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private responseListeners: Map<string, Set<(payload: any) => void>> =
    new Map();

  constructor(config: IBridge<TRequestHandlers, TResponseHandlers>) {
    this.config = config;
    this.version = config.version;
    this.initMessageListener();
  }

  request<T extends keyof TRequestHandlers>(
    type: T,
    params: HandlerParamsType<TRequestHandlers[T], typeof this.version>
  ): Promise<HandlerReturnType<TRequestHandlers[T], typeof this.version>> {
    const handlerVersion = findBestHandlerVersion(
      this.config.requestHandlers[type],
      this.version
    );

    const handler = this.config.requestHandlers[type][handlerVersion];

    if (!handler) {
      throw new DefaultBridgeError(`No handler for type ${String(type)}`);
    }
    return handler(params);
  }

  addResponseListener<T extends keyof TResponseHandlers>(
    type: T,
    listener: (
      payload: HandlerParamsType<TResponseHandlers[T], typeof this.version>
    ) => void
  ) {
    if (!this.responseListeners.has(type as string)) {
      this.responseListeners.set(type as string, new Set());
    }
    this.responseListeners.get(type as string)!.add(listener);
  }

  removeResponseListener<T extends keyof TResponseHandlers>(
    type: T,
    listener: (
      payload: HandlerParamsType<TResponseHandlers[T], typeof this.version>
    ) => void
  ) {
    const listeners = this.responseListeners.get(type as string);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  private initMessageListener() {
    window.addEventListener("message", this.handleMessage.bind(this));
  }

  private handleMessage(event: MessageEvent) {
    try {
      const { type, payload } = JSON.parse(event.data) as DefaultBridgeMessage;
      const handler =
        this.config.responseHandlers[type]?.[this.version] ||
        this.config.responseHandlers[type]?.["default"];

      if (handler) {
        const result = handler(payload);

        const listeners = this.responseListeners.get(type);
        if (listeners) {
          listeners.forEach((listener) => listener(result));
        }
      } else {
        throw new DefaultBridgeError(`No handler for type ${String(type)}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (this.config.errorHandlers?.default) {
          const defaultBridgeError: DefaultBridgeError = {
            name: "DefaultBridgeError",
            message: error.message,
          };
          this.config.errorHandlers.default(defaultBridgeError);
        }
      }
    }
  }
}

export default Bridge;
