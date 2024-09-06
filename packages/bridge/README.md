# @webviewkit/bridge

@webviewkit/bridge is a TypeScript library that facilitates communication between WebView and native platforms. It provides a flexible, version-aware bridge implementation for seamless interaction in hybrid mobile applications.

## Installation

```bash
npm install @webviewkit/bridge
# or
yarn add @webviewkit/bridge
# or
pnpm add @webviewkit/bridge
```

## Features

- Type-safe communication between WebView and native platforms
- Intelligent version-aware API handling
- Support for iOS, Android, and React Native
- Customizable error handling
- Flexible request and response handlers
- Automatic selection of the most appropriate handler based on semantic versioning

## Usage

Here's a basic example of how to use @webviewkit/bridge:

```typescript
import { createBridgeWithVersion } from "@webviewkit/bridge";

const bridge = createBridgeWithVersion("1.2.3", {
  requestHandlers: {
    getUser: {
      "1.0.0": async ({ userId }: { userId: string }) => {
        // Implementation for version 1.0.0 and above, but below 2.0.0
        return { id: userId, name: "John Doe" };
      },
      "2.0.0": async ({ userId }: { userId: string }) => {
        // Implementation for version 2.0.0 and above
        return { id: userId, name: "John Doe", email: "john@example.com" };
      },
      default: async ({ userId }: { userId: string }) => {
        // Default implementation for versions below 1.0.0
        return { id: userId };
      },
    },
  },
  responseHandlers: {
    userUpdated: {
      "1.0.0": (payload: { id: string; name: string }) => {
        console.log("User updated (1.0.0):", payload);
        return { success: true };
      },
      "2.0.0": (payload: { id: string; name: string; email: string }) => {
        console.log("User updated (2.0.0):", payload);
        return { success: true, timestamp: new Date().toISOString() };
      },
      default: (payload: { id: string }) => {
        console.log("User updated (default):", payload);
        return { success: true };
      },
    },
  },
  // Optional: Customize bridge implementations
  bridges: {
    ios: {
      postMessage: (payload: string) =>
        window.webkit.messageHandlers.bridge.postMessage(payload),
    },
    android: {
      postMessage: (payload: string) => window.Android.postMessage(payload),
    },
    ReactNative: {
      postMessage: (payload: string) =>
        window.ReactNativeWebView.postMessage(payload),
    },
  },
  // Optional: Custom error handler
  errorHandlers: {
    default: (error: Error) => {
      console.error("Bridge error:", error);
    },
  },
});

// Make a request
bridge
  .request("getUser", { userId: "123" })
  .then((user) => console.log("User:", user))
  .catch((error) => console.error("Error:", error));

// Add a response listener
bridge.addResponseListener("userUpdated", (updatedUser) => {
  console.log("User updated:", updatedUser);
});
```

## Version Handling

The bridge intelligently selects the most appropriate handler based on the current version:

- If an exact version match is found, that handler is used.
- If no exact match is found, it uses the handler from the highest version that's lower than the current version.
- If no suitable version is found, it falls back to the 'default' handler.

For example, with handlers defined for versions "1.0.0", "1.6.1", and "2.0.1":

- Version "1.2.1" will use the "1.0.0" handler
- Version "1.6.1" will use the "1.6.1" handler
- Version "2.0.3" will use the "2.0.1" handler
- Version "0.6.1" will use the "default" handler

## API

### `createBridgeWithVersion`

A function that creates a new Bridge instance with version-aware handlers.

```typescript
function createBridgeWithVersion<
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
): Bridge<TRequestHandlers, TResponseHandlers>;
```

### `Bridge<TRequestHandlers, TResponseHandlers>`

The main class for handling bridge operations.

#### Methods

- `request<T extends keyof TRequestHandlers>(type: T, params: HandlerParamsType<TRequestHandlers[T], typeof this.version>): Promise<HandlerReturnType<TRequestHandlers[T], typeof this.version>>`

  Sends a request to the native platform, automatically selecting the appropriate version handler.

- `addResponseListener<T extends keyof TResponseHandlers>(type: T, listener: (payload: HandlerParamsType<TResponseHandlers[T], typeof this.version>) => void)`

  Adds a listener for a specific response type.

- `removeResponseListener<T extends keyof TResponseHandlers>(type: T, listener: (payload: HandlerParamsType<TResponseHandlers[T], typeof this.version>) => void)`

  Removes a previously added listener.

### Types

- `SemverVersion`: Represents a semantic version string or "default".
- `RequestHandler<T, R>`: Represents a function that handles requests.
- `ResponseHandler<T, R>`: Represents a function that handles responses.
- `RequestHandlers`: A map of versioned request handlers.
- `ResponseHandlers`: A map of versioned response handlers.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
