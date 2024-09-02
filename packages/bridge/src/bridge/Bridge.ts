/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BridgeHandler,
  BridgeOptions,
  BridgeRequest,
  Interceptor,
  MessageSender,
  PlatformSpecificMethod,
} from "./Bridge.type";

export class Bridge<TMethods extends Record<string, PlatformSpecificMethod>> {
  private readonly methods: TMethods;
  private readonly messageSender: MessageSender;
  private readonly bridgeHandler: BridgeHandler;

  constructor(options: BridgeOptions<TMethods>) {
    this.methods = options.methods;
    this.messageSender = options.messageSender;
    this.bridgeHandler = options.bridgeHandler;
  }

  call = async <TMethod extends keyof TMethods>(
    method: TMethod,
    params?: Parameters<TMethods[TMethod]>[0],
    interceptors?: Interceptor<Parameters<TMethods[TMethod]>[0]>[]
  ): Promise<ReturnType<TMethods[TMethod]>> => {
    const request: BridgeRequest<Parameters<TMethods[TMethod]>[0]> = {
      id: this.generateRequestId(),
      method: method as string,
      params,
    };

    const interceptedRequest = await this.applyInterceptors(
      request,
      interceptors
    );
    return this.dispatchMethod(interceptedRequest);
  };

  private generateRequestId = (): string => {
    return Math.random().toString(36).substring(7);
  };

  private dispatchMethod = <TParams, TResult>(
    request: BridgeRequest<TParams>
  ): Promise<TResult> => {
    const executor = this.methods[request.method as keyof TMethods];

    if (!executor) {
      throw new Error(`No method found for ${request.method}`);
    }

    return executor(request.params) as Promise<TResult>;
  };

  private applyInterceptors = async <TParams>(
    request: BridgeRequest<TParams>,
    interceptors?: Interceptor<TParams>[]
  ): Promise<BridgeRequest<TParams>> => {
    if (!interceptors || interceptors.length === 0) {
      return request;
    }

    const applyInterceptor = async (
      interceptedRequest: BridgeRequest<TParams>,
      interceptor: Interceptor<TParams>
    ): Promise<BridgeRequest<TParams>> => interceptor(interceptedRequest);

    let interceptedRequest = request;
    for (const interceptor of interceptors) {
      interceptedRequest = await applyInterceptor(
        interceptedRequest,
        interceptor
      );
    }

    return interceptedRequest;
  };

  handleNativeCall = (
    methodName: keyof TMethods,
    params: any
  ): Promise<any> => {
    return this.call(methodName, params);
  };

  initialize = (): void => {
    this.bridgeHandler((methodName: string, params: any) => {
      this.handleNativeCall(methodName as keyof TMethods, params)
        .then((result) => {
          this.messageSender(JSON.stringify({ result }));
        })
        .catch((error) => {
          this.messageSender(JSON.stringify({ error: error.message }));
        });
    });
  };
}
