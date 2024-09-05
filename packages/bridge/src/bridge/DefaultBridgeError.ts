export class DefaultBridgeError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
