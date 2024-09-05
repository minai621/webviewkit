import {
  Bridge,
  DefaultBridgeError,
  IBridge,
  RequestHandlers,
  ResponseHandlers,
} from "@/bridge";

describe("Bridge", () => {
  let bridge: Bridge<RequestHandlers, ResponseHandlers>;
  let mockRequestHandlers: RequestHandlers;
  let mockResponseHandlers: ResponseHandlers;
  let mockConfig: IBridge<RequestHandlers, ResponseHandlers>;
  let mockErrorHandler: jest.Mock;

  beforeEach(() => {
    mockRequestHandlers = {
      getUserProfile: {
        "1.0.0": jest.fn().mockResolvedValue({ name: "John", age: 30 }),
        "2.0.0": jest.fn().mockResolvedValue({
          name: "John",
          age: 30,
          email: "john@example.com",
        }),
        default: jest.fn().mockResolvedValue({ name: "John" }),
      },
    };

    mockResponseHandlers = {
      log: {
        "1.0.0": jest.fn().mockReturnValue({ success: true }),
        "2.0.0": jest.fn().mockReturnValue({
          success: true,
          timestamp: "2023-01-01T00:00:00Z",
        }),
        default: jest.fn().mockReturnValue({ success: true }),
      },
    };

    mockErrorHandler = jest.fn();

    mockConfig = {
      version: "1.0.0",
      bridges: {
        ios: { postMessage: jest.fn() },
        android: { postMessage: jest.fn() },
        ReactNative: { postMessage: jest.fn() },
      },
      requestHandlers: mockRequestHandlers,
      responseHandlers: mockResponseHandlers,
      errorHandlers: {
        default: mockErrorHandler,
      },
    };

    bridge = new Bridge(mockConfig);
  });

  describe("constructor", () => {
    it("should create a Bridge instance with correct version", () => {
      expect(bridge.version).toBe("1.0.0");
    });
  });

  describe("request", () => {
    it("should call the correct request handler for the current version", async () => {
      const result = await bridge.request("getUserProfile", { userId: "123" });
      expect(result).toEqual({ name: "John", age: 30 });
      expect(mockRequestHandlers.getUserProfile["1.0.0"]).toHaveBeenCalledWith({
        userId: "123",
      });
    });

    it("should use the default handler if version-specific handler is not available", async () => {
      bridge = new Bridge({ ...mockConfig, version: "3.0.0" });
      const result = await bridge.request("getUserProfile", { userId: "123" });
      expect(result).toEqual({ name: "John" });
      expect(
        mockRequestHandlers.getUserProfile["default"]
      ).toHaveBeenCalledWith({ userId: "123" });
    });

    it("should throw a DefaultBridgeError if no handler is found", async () => {
      mockRequestHandlers.getUserProfile = {} as any;
      expect(() => bridge.request("getUserProfile", { userId: "123" })).toThrow(
        DefaultBridgeError
      );
    });
  });

  describe("response handling", () => {
    it("should call registered listeners when a response is received", () => {
      const listener = jest.fn();
      bridge.addResponseListener("log", listener);

      const messageEvent = new MessageEvent("message", {
        data: JSON.stringify({ type: "log", payload: { message: "Test log" } }),
      });
      window.dispatchEvent(messageEvent);

      expect(mockResponseHandlers.log["1.0.0"]).toHaveBeenCalledWith({
        message: "Test log",
      });
      expect(listener).toHaveBeenCalledWith({ success: true });
    });

    it("should remove listener when removeResponseListener is called", () => {
      const listener = jest.fn();
      bridge.addResponseListener("log", listener);
      bridge.removeResponseListener("log", listener);

      const messageEvent = new MessageEvent("message", {
        data: JSON.stringify({ type: "log", payload: { message: "Test log" } }),
      });
      window.dispatchEvent(messageEvent);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("version handling", () => {
    it("should use correct handler for different versions", () => {
      const bridge1 = new Bridge({ ...mockConfig, version: "1.0.0" });
      const bridge2 = new Bridge({ ...mockConfig, version: "2.0.0" });

      bridge1.request("getUserProfile", { userId: "123" });
      bridge2.request("getUserProfile", { userId: "123" });

      expect(mockRequestHandlers.getUserProfile["1.0.0"]).toHaveBeenCalled();
      expect(mockRequestHandlers.getUserProfile["2.0.0"]).toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should call error handler when an error occurs in message processing", () => {
      const invalidMessageEvent = new MessageEvent("message", {
        data: "invalid JSON",
      });
      window.dispatchEvent(invalidMessageEvent);

      expect(mockErrorHandler).toHaveBeenCalled();
    });
  });
});
