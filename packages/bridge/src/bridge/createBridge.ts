import { Bridge } from ".";
import { BridgeConfig, IEventTypes, IRequestTypes } from "./Bridge.type";

export function createBridge<T extends IRequestTypes, E extends IEventTypes>(
  config: BridgeConfig
): Bridge<T, E> {
  return new Bridge<T, E>(config);
}
