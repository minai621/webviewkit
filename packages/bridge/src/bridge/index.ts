import { Bridge } from "./Bridge";
import type {
  BridgeHandler,
  BridgeRequest,
  BridgeResponse,
  Interceptor,
  MessageSender,
  PlatformSpecificMethod,
} from "./Bridge.type";

export { Bridge };

export type {
  BridgeHandler,
  BridgeRequest,
  BridgeResponse,
  Interceptor,
  MessageSender,
  PlatformSpecificMethod,
};

export function createBridge<
  TMethods extends Record<string, PlatformSpecificMethod>,
>(options: {
  methods: TMethods;
  messageSender: MessageSender;
  bridgeHandler: BridgeHandler;
}): Bridge<TMethods> {
  return new Bridge<TMethods>({
    methods: options.methods,
    messageSender: options.messageSender,
    bridgeHandler: options.bridgeHandler,
  });
}
