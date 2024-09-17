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
import { createBridge } from "@webviewkit/bridge";

// Define request types
interface UserProfileRequestTypes extends IRequestTypes {
  getUserProfile: {
    default: {
      params: { userId: string };
      result: { id: string; name: string };
    };
    "1.0.0": {
      params: { userId: string };
      result: { id: string; name: string };
    };
    "2.0.0": {
      params: { userId: string; includeEmail: boolean };
      result: { id: string; name: string; email?: string };
    };
  };
  updateUserProfile: {
    default: {
      params: { userId: string; name: string };
      result: { success: boolean };
    };
    "1.0.0": {
      params: { userId: string; name: string };
      result: { success: boolean };
    };
    "2.0.0": {
      params: { userId: string; name: string; email?: string };
      result: { success: boolean; updatedAt: string };
    };
  };
}

// Define event types
interface UserEventTypes extends IEventTypes {
  onUserStatusChange: {
    default: { userId: string; status: "online" | "offline" };
    "1.0.0": { userId: string; status: "online" | "offline" };
    "2.0.0": {
      userId: string;
      status: "online" | "offline" | "away";
      lastSeen?: number;
    };
  };
}

// Create the bridge instance
const bridge = createBridge<UserProfileRequestTypes, UserEventTypes>({
  version: "2.0.0",
  bridges: {
    Android: {
      postMessage: (message: string) => {
        // Call Android native code
      },
    },
    iOS: {
      postMessage: (message: string) => {
        // Call iOS native code
      },
    },
    ReactNative: {
      postMessage: (message: string) => {
        // Call React Native native code
      },
    },
  },
  errorHandlers: {
    default: (error: Error) => {
      console.error("Bridge error:", error);
      return error;
    },
  },
  defaultTimeout: 5000,
});

// Make a request
async function getUserProfile(userId: string) {
  try {
    const [result, error] = await bridge.request("getUserProfile", [
      { version: "2.0.0", params: { userId, includeEmail: true } },
      { version: "1.0.0", params: { userId } },
      { version: "default", params: { userId } },
    ]);

    if (error) {
      console.error("Error fetching user profile:", error);
      return;
    }

    if (result) {
      console.log("User profile:", result);

      if (result.version === "2.0.0" && result.result.email) {
        console.log("User email:", result.result.email);
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

// Add a response listener
bridge.on("onUserStatusChange", (response) => {
  console.log("User status changed:", response);
  if (response.version === "2.0.0" && response.data.status === "away") {
    console.log("User last seen:", response.data.lastSeen);
  }
});

// Usage examples
getUserProfile("user123");
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

### `createBridge`

A function that creates a new Bridge instance with version-aware handlers.

```typescript
function createBridge<T extends IRequestTypes, E extends IEventTypes>(
  config: BridgeConfig
): Bridge<T, E>;
```

### `Bridge<T extends IRequestTypes, E extends IEventTypes>`

The main class for handling bridge operations.

#### Methods

- `request<M extends keyof T>(methodName: M, requests: VersionedRequest<T, M>[]): Promise<[VersionedResponse<T, M> | null, Error | null]>`

  Sends a request to the native platform, automatically selecting the appropriate version handler.

- `on<K extends keyof E>(eventName: K, handler: (response: EventResponse<E, K, keyof E[K] & string>) => void): void`

  Adds a listener for a specific event type.

- `off<K extends keyof E>(eventName: K): void`

  Removes a previously added listener.

### Types

- `SemverVersion`: Represents a semantic version string or "default".
- `IRequestTypes`: Represents the interface for defining request types.
- `IEventTypes`: Represents the interface for defining event types.
- `VersionedRequest<T extends IRequestTypes, M extends keyof T>`: Represents a versioned request.
- `VersionedResponse<T extends IRequestTypes, M extends keyof T>`: Represents a versioned response.
- `EventResponse<E extends IEventTypes, K extends keyof E>`: Represents an event response.
- `BridgeConfig`: Represents the configuration object for creating a `Bridge` instance.
  ```typescript
  interface BridgeConfig {
    version: SemverVersion;
    bridges: Bridges;
    errorHandlers: ErrorHandlers;
    defaultTimeout?: number;
  }
  ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
