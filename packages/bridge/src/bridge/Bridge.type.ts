/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultBridgeError } from "./DefaultBridgeError";

export type SemverVersion = `${number}.${number}.${number}` | "default";

export type RequestHandler<T, R> = (params: T) => Promise<R>;
export type ResponseHandler<T, R> = (params: T) => R;

export type VersionedHandlers<T> = {
  [V in SemverVersion]: T;
};

export type RequestHandlers = {
  [K: string]: VersionedHandlers<RequestHandler<any, any>>;
};

export type ResponseHandlers = {
  [K: string]: VersionedHandlers<ResponseHandler<any, any>>;
};

export type HandlerParamsType<T, V extends SemverVersion> =
  T extends VersionedHandlers<infer R>
    ? R extends RequestHandler<infer P, any> | ResponseHandler<infer P, any>
      ? V extends keyof T
        ? T[V] extends
            | RequestHandler<infer VP, any>
            | ResponseHandler<infer VP, any>
          ? VP
          : P
        : P
      : never
    : never;

export type HandlerReturnType<T, V extends SemverVersion> =
  T extends VersionedHandlers<infer R>
    ? R extends RequestHandler<any, infer RT> | ResponseHandler<any, infer RT>
      ? V extends keyof T
        ? T[V] extends
            | RequestHandler<any, infer VRT>
            | ResponseHandler<any, infer VRT>
          ? VRT
          : RT
        : RT
      : never
    : never;

export interface IBridge<
  TRequestHandlers extends RequestHandlers,
  TResponseHandlers extends ResponseHandlers,
> {
  version: SemverVersion;
  bridges: {
    [K in "ios" | "android" | "ReactNative"]: {
      postMessage: (payload: string) => void;
    };
  };
  requestHandlers: TRequestHandlers;
  responseHandlers: TResponseHandlers;
  errorHandlers: {
    [key: string]: (error: DefaultBridgeError) => void;
  };
}

export interface DefaultBridgeMessage<T = any> {
  type: string;
  payload: T;
}
