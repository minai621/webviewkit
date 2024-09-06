import {
  Bridge,
  DefaultBridgeError,
  IBridge,
  RequestHandlers,
  ResponseHandlers,
  SemverVersion,
} from ".";

export function createBridgeWithVersion<
  TRequestHandlers extends RequestHandlers,
  TResponseHandlers extends ResponseHandlers,
>(
  version: SemverVersion,
  options: {
    requestHandlers: TRequestHandlers;
    responseHandlers: TResponseHandlers;
    bridges?: {
      ios?: { postMessage: (payload: string) => void };
      android?: { postMessage: (payload: string) => void };
      ReactNative?: { postMessage: (payload: string) => void };
    };
    errorHandlers?: {
      [key: string]: (error: DefaultBridgeError) => void;
    };
  }
): Bridge<TRequestHandlers, TResponseHandlers> {
  const config: IBridge<TRequestHandlers, TResponseHandlers> = {
    version,
    bridges: {
      ios: options.bridges?.ios ?? {
        postMessage: (payload: string) =>
          console.log("Default iOS postMessage:", payload),
      },
      android: options.bridges?.android ?? {
        postMessage: (payload: string) =>
          console.log("Default Android postMessage:", payload),
      },
      ReactNative: options.bridges?.ReactNative ?? {
        postMessage: (payload: string) =>
          console.log("Default React Native postMessage:", payload),
      },
    },
    requestHandlers: options.requestHandlers,
    responseHandlers: options.responseHandlers,
    errorHandlers: options.errorHandlers ?? {
      default: (error: DefaultBridgeError) =>
        console.error("Default Bridge Error:", error),
    },
  };

  return new Bridge(config);
}
