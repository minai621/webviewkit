/* eslint-disable @typescript-eslint/no-explicit-any */
export type SemverVersion = `${number}.${number}.${number}` | "default";

export interface VersionedMethodBase {
  default: {
    params: unknown;
    result: unknown;
  };
  [version: string]: {
    params: unknown;
    result: unknown;
  };
}

export interface IRequestTypes {
  [methodName: string]: VersionedMethodBase;
}

export type RequestParams<
  T extends IRequestTypes,
  M extends keyof T,
  V extends keyof T[M] & SemverVersion,
> = T[M][V] extends { params: infer P } ? P : never;

export type RequestResult<
  T extends IRequestTypes,
  M extends keyof T,
  V extends keyof T[M] & SemverVersion,
> = T[M][V] extends { result: infer R } ? R : never;

export type VersionedRequest<T extends IRequestTypes, M extends keyof T> = {
  [V in keyof T[M] & SemverVersion]: {
    version: V;
    params: RequestParams<T, M, V>;
  };
}[keyof T[M] & SemverVersion];

export type VersionedResponse<T extends IRequestTypes, M extends keyof T> = {
  [V in keyof T[M] & SemverVersion]: {
    version: V;
    result: RequestResult<T, M, V>;
  };
}[keyof T[M] & SemverVersion];

export interface VersionedEventBase<T = any> {
  default: T;
  [version: string]: T;
}

export interface IEventTypes {
  [eventName: string]: VersionedEventBase;
}

export type EventResponse<
  E extends IEventTypes,
  K extends keyof E,
  V extends keyof E[K] = keyof E[K],
> = V extends keyof E[K] ? { version: V; data: E[K][V] } : never;

export interface IBridge<T extends IRequestTypes, E extends IEventTypes> {
  request<M extends keyof T>(
    methodName: M,
    requests: VersionedRequest<T, M>[]
  ): Promise<[VersionedResponse<T, M> | null, Error | null]>;

  on<K extends keyof E>(
    eventName: K,
    handler: (response: EventResponse<E, K, keyof E[K] & string>) => void
  ): void;

  off<K extends keyof E>(eventName: K): void;
}

export type OS = "Android" | "iOS" | "ReactNative";

export interface BridgeInterface {
  postMessage: (message: string) => void;
}

export interface Bridges {
  Android: BridgeInterface;
  iOS: BridgeInterface;
  ReactNative: BridgeInterface;
}

export interface BridgeConfig {
  bridges: Bridges;
  defaultTimeout?: number;
  version: SemverVersion;
}

export type ErrorHandler = (error: Error) => Error;

export interface ErrorHandlers {
  [key: string]: ErrorHandler;
  default: ErrorHandler;
}

export interface BridgeResponse {
  id: string;
  type: "response" | "event";
  method: string;
  version: string;
  payload: any;
  error: {
    type: string;
    message: string;
  } | null;
}
