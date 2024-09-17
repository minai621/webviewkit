import Bridge from "./Bridge";
import {
  BridgeConfig,
  BridgeInterface,
  BridgeResponse,
  Bridges,
  ErrorHandler,
  ErrorHandlers,
  IBridge,
  IEventTypes,
  IRequestTypes,
  SemverVersion,
  VersionedRequest,
  VersionedResponse,
} from "./Bridge.type";
import {
  DefaultBridgeError,
  NetworkError,
  TimeoutError,
} from "./DefaultBridgeError";
import { createBridge } from "./createBridge";

export type {
  BridgeConfig,
  BridgeInterface,
  BridgeResponse,
  Bridges,
  ErrorHandler,
  ErrorHandlers,
  IBridge,
  IEventTypes,
  IRequestTypes,
  SemverVersion,
  VersionedRequest,
  VersionedResponse,
};

export { Bridge, DefaultBridgeError, NetworkError, TimeoutError, createBridge };
