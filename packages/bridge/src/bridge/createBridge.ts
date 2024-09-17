import { Bridge, BridgeConfig, IEventTypes, IRequestTypes } from "@/bridge";

export function createBridge<T extends IRequestTypes, E extends IEventTypes>(
  config: BridgeConfig
): Bridge<T, E> {
  return new Bridge<T, E>(config);
}
