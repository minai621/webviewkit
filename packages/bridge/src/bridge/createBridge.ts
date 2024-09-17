import { Bridge, ErrorHandlers } from ".";
import { BridgeConfig, IEventTypes, IRequestTypes } from "./Bridge.type";

export function createBridge<T extends IRequestTypes, E extends IEventTypes>(
  errorHandlers: ErrorHandlers,
  config: BridgeConfig
): Bridge<T, E> {
  return new Bridge<T, E>(errorHandlers, config);
}
