/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BridgeRequest<TParams = any> {
  id: string;
  method: string;
  params: TParams;
}

export interface BridgeResponse<TResult = any> {
  result?: TResult;
  error?: string;
}

export type PlatformSpecificMethod<TParams = any, TResult = any> = (
  params: TParams
) => Promise<TResult>;

export type MessageSender = (message: string) => void;

export type BridgeHandler = (
  handler: (methodName: string, params: any) => void
) => void;

export type Interceptor<TParams = any> = (
  request: BridgeRequest<TParams>
) => Promise<BridgeRequest<TParams>> | BridgeRequest<TParams>;

export interface BridgeOptions<
  TMethods extends Record<string, PlatformSpecificMethod>,
> {
  methods: TMethods;
  messageSender: MessageSender;
  bridgeHandler: BridgeHandler;
}
