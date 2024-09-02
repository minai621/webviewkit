import { Bridge, Interceptor, PlatformSpecificMethod } from "@/bridge";
import { getEnvironment } from "@webviewkit/environment";

describe("Bridge", () => {
  type TestMethods = typeof testMethods;
  let bridge: Bridge<TestMethods>;

  const testMethods: Record<string, PlatformSpecificMethod> = {
    addNumbers: async (params) => params.a + params.b,
    getMessage: async (params) => `Hello, ${params.name}!`,
  };

  const messageSender: (message: string) => void = (message) => {
    console.log("Sent message:", message);
  };

  const bridgeHandler: (
    handler: (methodName: string, params: any) => void
  ) => void = (handler) => {
    handler("addNumbers", { a: 2, b: 3 });
    handler("getMessage", { name: "Alice" });
  };

  beforeEach(() => {
    bridge = new Bridge<TestMethods>({
      methods: testMethods,
      messageSender,
      bridgeHandler,
    });
  });

  it("should call a method successfully", async () => {
    const result = await bridge.call("addNumbers", { a: 2, b: 3 });
    expect(result).toBe(5);
  });

  it("should handle a native call", async () => {
    const result = await bridge.handleNativeCall("addNumbers", { a: 2, b: 3 });
    expect(result).toBe(5);
  });

  it("should apply interceptors", async () => {
    const interceptor: Interceptor<{ a: number; b: number }> = async (
      request
    ) => {
      console.log(request.params);
      return {
        ...request,
        params: { a: request.params?.a * 2, b: request.params?.b * 2 },
      };
    };

    const result = await bridge.call("addNumbers", { a: 2, b: 3 }, [
      interceptor,
    ]);
    expect(result).toBe(10);
  });

  it("should handle errors", async () => {
    const errorInterceptor: Interceptor<{ name: string }> = async () => {
      throw new Error("Interceptor error");
    };

    await expect(
      bridge.call("getMessage", { name: "Alice" }, [errorInterceptor])
    ).rejects.toThrow("Interceptor error");
  });

  it("should handle Android platform", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 10.0; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.93 Mobile Safari/537.36";
    const env = getEnvironment(userAgent);
    expect(env.os.name).toBe("Android");
    expect(env.os.version).toBe("10.0");

    const androidMessageSender = (message: string) => {
      (window as any).Android.postMessage(message);
    };

    const androidBridgeHandler = (
      handler: (methodName: string, params: any) => void
    ) => {
      handler("addNumbers", { a: 4, b: 5 });
      handler("getMessage", { name: "Bob" });
    };

    bridge = new Bridge<TestMethods>({
      methods: testMethods,
      messageSender: androidMessageSender,
      bridgeHandler: androidBridgeHandler,
    });

    expect(bridge.call("addNumbers", { a: 4, b: 5 })).resolves.toBe(9);
    expect(bridge.call("getMessage", { name: "Bob" })).resolves.toBe(
      "Hello, Bob!"
    );
  });

  it("should handle iOS platform", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
    const env = getEnvironment(userAgent);
    expect(env.os.name).toBe("iOS");
    expect(env.os.version).toBe("14.4");

    const iosMessageSender = (message: string) => {
      (window as any).webkit.messageHandlers.bridge.postMessage(message);
    };

    const iosBridgeHandler = (
      handler: (methodName: string, params: any) => void
    ) => {
      handler("addNumbers", { a: 6, b: 7 });
      handler("getMessage", { name: "Charlie" });
    };

    bridge = new Bridge<TestMethods>({
      methods: testMethods,
      messageSender: iosMessageSender,
      bridgeHandler: iosBridgeHandler,
    });

    expect(bridge.call("addNumbers", { a: 6, b: 7 })).resolves.toBe(13);
    expect(bridge.call("getMessage", { name: "Charlie" })).resolves.toBe(
      "Hello, Charlie!"
    );
  });

  it("should handle React Native platform", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.150 XWEB/2797 MMWEBSDK/20201202 Mobile Safari/537.36";

    (window as any).ReactNativeWebView = {
      postMessage: (message: string) => {
        console.log("Sent message:", message);
      },
    };

    function isReactNativeWebView(): boolean {
      return (
        typeof window !== "undefined" && !!(window as any).ReactNativeWebView
      );
    }

    function getCurrentPlatform(
      userAgent: string
    ): "react-native" | "ios" | "android" | "web" {
      if (isReactNativeWebView()) {
        return "react-native";
      } else if (getEnvironment(userAgent).os.name === "iOS") {
        return "ios";
      } else if (getEnvironment(userAgent).os.name === "Android") {
        return "android";
      }
      return "web";
    }

    const platform = getCurrentPlatform("any user agent");
    expect(platform).toBe("react-native");

    const rnMessageSender = (message: string) => {
      (window as any).ReactNativeWebView.postMessage(message);
    };

    const rnBridgeHandler = (
      handler: (methodName: string, params: any) => void
    ) => {
      handler("addNumbers", { a: 8, b: 9 });
      handler("getMessage", { name: "David" });
    };

    bridge = new Bridge<TestMethods>({
      methods: testMethods,
      messageSender: rnMessageSender,
      bridgeHandler: rnBridgeHandler,
    });

    expect(bridge.call("addNumbers", { a: 8, b: 9 })).resolves.toBe(17);
    expect(bridge.call("getMessage", { name: "David" })).resolves.toBe(
      "Hello, David!"
    );
  });
});
