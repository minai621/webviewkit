export class DefaultBridgeError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "DefaultBridgeError";
  }
}

export class TimeoutError extends DefaultBridgeError {
  constructor(message: string) {
    super(message, "TIMEOUT");
    this.name = "TimeoutError";
  }
}

export class NetworkError extends DefaultBridgeError {
  constructor(message: string) {
    super(message, "NETWORK");
    this.name = "NetworkError";
  }
}
