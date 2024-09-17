import {
  BridgeConfig,
  Bridges,
  ErrorHandlers,
  IEventTypes,
  IRequestTypes,
  SemverVersion,
} from "@bridge/Bridge.type";
import { DefaultBridgeError, TimeoutError } from "@bridge/DefaultBridgeError";
import { createBridge } from "@bridge/createBridge";
import * as environment from "@webviewkit/environment";

jest.mock("@webviewkit/environment", () => ({
  getEnvironment: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

class CustomError extends DefaultBridgeError {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

describe("Bridge", () => {
  const mockAndroidBridge = { postMessage: jest.fn() };
  const mockIOSBridge = { postMessage: jest.fn() };
  const mockRNBridge = { postMessage: jest.fn() };

  const bridges: Bridges = {
    Android: mockAndroidBridge,
    iOS: mockIOSBridge,
    ReactNative: mockRNBridge,
  };

  interface TestRequestTypes extends IRequestTypes {
    getUserProfile: {
      default: {
        params: { userId: string };
        result: { id: string; name: string };
      };
      "1.0.0": {
        params: { userId: string };
        result: { id: string; name: string };
      };
      "1.6.3": {
        params: { userId: string };
        result: { id: string; name: string; age: number };
      };
      "2.1.1": {
        params: { userId: string };
        result: { id: string; name: string; age: number; email: string };
      };
    };
  }

  interface TestEventTypes extends IEventTypes {
    onUserStatusChange: {
      default: { userId: string; status: "online" | "offline" };
      "1.0.0": { userId: string; status: "online" | "offline" };
      "1.5.0": {
        userId: string;
        status: "online" | "offline" | "away";
        lastSeen: number;
      };
    };
  }

  const errorHandlers: ErrorHandlers = {
    "custom-error": (error) => {
      return new CustomError(error.message);
    },
    default: (error) => new DefaultBridgeError(error.message),
  };

  const config: BridgeConfig = {
    version: "1.0.0",
    bridges,
    defaultTimeout: 1000,
  };

  const setupBridge = (os: string, version: SemverVersion = "1.7.0") => {
    (environment.getEnvironment as jest.Mock).mockReturnValue({
      os: { name: os },
    });
    return createBridge<TestRequestTypes, TestEventTypes>(errorHandlers, {
      ...config,
      version,
    });
  };

  const simulateResponse = (response: any) => {
    const responseEvent = new MessageEvent("message", {
      data: JSON.stringify(response),
    });
    window.dispatchEvent(responseEvent);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should select the correct bridge based on OS", async () => {
    const bridge = setupBridge("Android");
    const requestPromise = bridge.request("getUserProfile", [
      { version: "default", params: { userId: "123" } },
      { version: "1.0.0", params: { userId: "123" } },
    ]);

    expect(mockAndroidBridge.postMessage).toHaveBeenCalled();
    expect(mockIOSBridge.postMessage).not.toHaveBeenCalled();
    expect(mockRNBridge.postMessage).not.toHaveBeenCalled();

    simulateResponse({
      id: "mocked-uuid",
      type: "response",
      version: "1.0.0",
      payload: { id: "123", name: "John Doe" },
    });

    const [result, error] = await requestPromise;
    expect(error).toBeNull();
    expect(result).toEqual({
      version: "1.0.0",
      result: { id: "123", name: "John Doe" },
    });
  });

  it("should select the correct method version", async () => {
    const bridge = setupBridge("iOS", "1.8.0");

    const requestPromise = bridge.request("getUserProfile", [
      { version: "default", params: { userId: "123" } },
      { version: "1.0.0", params: { userId: "123" } },
      { version: "1.6.3", params: { userId: "123" } },
      { version: "2.1.1", params: { userId: "123" } },
    ]);

    const postMessageArg = JSON.parse(
      mockIOSBridge.postMessage.mock.calls[0][0]
    );
    expect(postMessageArg.version).toBe("1.6.3");

    simulateResponse({
      id: "mocked-uuid",
      type: "response",
      version: "1.6.3",
      payload: { id: "123", name: "John Doe", age: 30 },
    });

    const [result, error] = await requestPromise;
    expect(error).toBeNull();
    expect(result).toEqual({
      version: "1.6.3",
      result: { id: "123", name: "John Doe", age: 30 },
    });
  });

  it("should handle timeout errors", async () => {
    const bridge = setupBridge("iOS", "2.0.0");

    const requestPromise = bridge.request("getUserProfile", [
      { version: "default", params: { userId: "123" } },
      { version: "2.1.1", params: { userId: "123" } },
      { version: "1.0.0", params: { userId: "123" } },
    ]);

    jest.advanceTimersByTime(2000);

    const [result, error] = await requestPromise;
    expect(result).toBeNull();
    expect(error).toBeInstanceOf(TimeoutError);
    expect(error?.message).toBe(
      "Request timeout for method getUserProfile version 1.0.0"
    );
  });

  it("should handle custom errors", async () => {
    const bridge = setupBridge("iOS", "2.0.0");

    const requestPromise = bridge.request("getUserProfile", [
      { version: "1.0.0", params: { userId: "123" } },
    ]);

    simulateResponse({
      id: "mocked-uuid",
      type: "response",
      error: { type: "custom-error", message: "Custom error occurred" },
    });

    const [result, error] = await requestPromise;
    expect(result).toBeNull();
    expect(error).toBeInstanceOf(CustomError);
    expect(error?.message).toBe("Custom error occurred");
  });

  it("should handle events with correct version", () => {
    const bridge = setupBridge("Android", "1.6.0");
    const eventHandler = jest.fn();

    bridge.on("onUserStatusChange", eventHandler);

    simulateResponse({
      type: "event",
      method: "onUserStatusChange",
      version: "1.5.0",
      payload: { userId: "123", status: "away", lastSeen: 1623456789 },
    });

    expect(eventHandler).toHaveBeenCalledWith({
      version: "1.5.0",
      data: { userId: "123", status: "away", lastSeen: 1623456789 },
    });
  });

  it("should handle unknown events", () => {
    const bridge = setupBridge("iOS", "2.0.0");
    const eventHandler = jest.fn();

    bridge.on("onUserStatusChange", eventHandler);

    simulateResponse({
      type: "event",
      method: "unknownEvent",
      version: "1.0.0",
      payload: { someData: "value" },
    });

    simulateResponse({
      type: "event",
      method: "onUserStatusChange",
      version: "1.0.0",
      payload: { userId: "123", status: "online" },
    });

    expect(eventHandler).not.toHaveBeenCalledWith(
      expect.objectContaining({
        version: "1.0.0",
        data: { someData: "value" },
      })
    );

    expect(eventHandler).toHaveBeenCalledWith({
      version: "1.0.0",
      data: { userId: "123", status: "online" },
    });

    expect(eventHandler).toHaveBeenCalledTimes(1);
  });
});
