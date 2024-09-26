# @webviewkit/bridgedocs

`@webviewkit/bridgedocs` is a TypeScript library designed to automatically generate API documentation for WebView bridge interfaces. It works seamlessly with `@webviewkit/bridge` to provide comprehensive documentation for your bridge API interactions.

## Features

- Automatic generation of documentation for WebView bridge interfaces
- Support for Markdown and JSON output formats
- Customizable configuration for include/exclude directories
- Seamless integration with TypeScript projects
- Detailed documentation of request/response types and event handlers
- Version-aware API documentation

## Installation

Install the library using one of the following commands:

```bash
npm install @webviewkit/bridgedocs --save-dev
# or
yarn add @webviewkit/bridgedocs --dev
# or
pnpm add @webviewkit/bridgedocs --save-dev
```

## Configuration and Usage

To use `@webviewkit/bridgedocs`, follow these steps:

1. Create a configuration file (e.g., `bridgedoc.config.ts`) in your project root:

```typescript
import { generateDocs } from "@webviewkit/bridgedocs";
import { Config } from "@webviewkit/bridgedocs";
import path from "path";

const config: Config = {
  include: [path.resolve(__dirname, "src")],
  exclude: [],
  outDir: "./docs",
  outputFormats: ["markdown", "json"],
  tsConfigPath: "./tsconfig.json",
};

async function runDocGeneration() {
  try {
    console.log("Generating documentation...");
    await generateDocs(config);
    console.log(
      "Documentation generated successfully. Check the output folder."
    );
  } catch (error) {
    console.error("Error generating documentation:", error);
  }
}

runDocGeneration();
```

2. Add a script to your `package.json`:

```json
{
  "scripts": {
    "generate-docs": "ts-node bridgedoc.config.ts"
  }
}
```

3. Run the documentation generator:

```bash
npm run generate-docs
```

This will generate the API documentation based on your TypeScript files in the specified output directory.

### Configuration Options

- `include`: An array of paths to include for documentation generation.
- `exclude`: An array of paths to exclude from documentation generation.
- `outDir`: The output directory for the generated documentation.
- `outputFormats`: An array specifying the desired output formats (`"markdown"` and/or `"json"`).
- `tsConfigPath`: The path to your TypeScript configuration file.

## Writing Documentation

Use JSDoc-style comments to document your interfaces that extend `IRequestTypes` or `IEventTypes` from `@webviewkit/bridge`. Here's a comprehensive example:

```typescript
import { IEventTypes, IRequestTypes } from "@webviewkit/bridge";

/**
 * User profile related requests
 * @since 1.0.0
 */
interface UserProfileRequestTypes extends IRequestTypes {
  /**
   * Retrieves user profile information
   * @example getUserProfile({ userId: '123' })
   */
  getUserProfile: {
    /**
     * @since 1.0.0
     */
    default: {
      params: {
        /** The unique identifier of the user */
        userId: string;
      };
      result: {
        /** The user's unique identifier */
        id: string;
        /** The user's name */
        name: string;
      };
    };
    /**
     * Version with added email field
     * @since 2.0.0
     */
    "2.0.0": {
      params: {
        /** The unique identifier of the user */
        userId: string;
        /** Flag to include email in the response */
        includeEmail: boolean;
      };
      result: {
        /** The user's unique identifier */
        id: string;
        /** The user's name */
        name: string;
        /** The user's email (if requested) */
        email?: string;
      };
    };
  };
}

/**
 * User event related types
 * @since 1.0.0
 */
interface UserEventTypes extends IEventTypes {
  /**
   * Event triggered when user status changes
   * @example onUserStatusChange({ userId: '123', status: 'online' })
   */
  onUserStatusChange: {
    /** @deprecated Use version 1.0.0 or later */
    default: {
      /** The unique identifier of the user */
      userId: string;
      /** The new status of the user */
      status: "online" | "offline";
    };
    /**
     * @since 1.0.0
     */
    "1.0.0": {
      /** The unique identifier of the user */
      userId: string;
      /** The new status of the user */
      status: "online" | "offline";
    };
    /**
     * Version with 'away' status and last activity timestamp
     * @since 2.0.0
     */
    "2.0.0": {
      /** The unique identifier of the user */
      userId: string;
      /** The new status of the user */
      status: "online" | "offline" | "away";
      /** Timestamp of last activity */
      lastSeen?: number;
    };
  };
}
```

### Supported JSDoc Tags

- `@since`: Specifies the version when the API was introduced.
- `@deprecated`: Marks an API as no longer in use.
- `@example`: Provides usage examples.

## Generated Documentation

The generator will create a Markdown file (and optionally a JSON file) in your specified output directory. Here's an example of the generated Markdown:

````markdown
# API Documentation

## UserProfileRequestTypes

_Available since version 1.0.0_

User profile related requests

### getUserProfile

Retrieves user profile information

#### Versions

<details>
<summary>Version: default</summary>

_Since: 1.0.0_

**Request:**

| Parameter | Type     | Optional | Description                       |
| --------- | -------- | -------- | --------------------------------- |
| `userId`  | `string` | ❌       | The unique identifier of the user |

**Response:**

| Property | Type     | Optional | Description                  |
| -------- | -------- | -------- | ---------------------------- |
| `id`     | `string` | ❌       | The user's unique identifier |
| `name`   | `string` | ❌       | The user's name              |

**Example:**

```typescript
getUserProfile({ userId: "123" });
```

</details>

<details>
<summary>Version: 2.0.0</summary>

_Since: 2.0.0_

Version with added email field

**Request:**

| Parameter      | Type      | Optional | Description                           |
| -------------- | --------- | -------- | ------------------------------------- |
| `userId`       | `string`  | ❌       | The unique identifier of the user     |
| `includeEmail` | `boolean` | ❌       | Flag to include email in the response |

**Response:**

| Property | Type     | Optional | Description                     |
| -------- | -------- | -------- | ------------------------------- |
| `id`     | `string` | ❌       | The user's unique identifier    |
| `name`   | `string` | ❌       | The user's name                 |
| `email`  | `string` | ✅       | The user's email (if requested) |

**Example:**

```typescript
getUserProfile({ userId: "123", includeEmail: true });
```

</details>

## UserEventTypes

_Available since version 1.0.0_

User event related types

### onUserStatusChange

Event triggered when user status changes

#### Versions

<details>
<summary>Version: default</summary>

> **Deprecated:** Use version 1.0.0 or later

**Event Parameters:**

| Parameter | Type                    | Optional | Description                       |
| --------- | ----------------------- | -------- | --------------------------------- |
| `userId`  | `string`                | ❌       | The unique identifier of the user |
| `status`  | `"online" or "offline"` | ❌       | The new status of the user        |

**Example:**

```typescript
onUserStatusChange({ userId: "123", status: "online" });
```

</details>

... (other versions would follow)
````

## Troubleshooting

- If your documentation is not generating, ensure your `include` path in the configuration is correct and your TypeScript files are in the specified location.
- Make sure your interfaces extend `IRequestTypes` or `IEventTypes` from `@webviewkit/bridge`.
- If certain parts of your API are not documented, check that you've added the appropriate JSDoc comments.
- If you encounter any TypeScript-related errors, ensure that your `tsConfigPath` is correctly set in the configuration.

## Contributing

We welcome contributions to this project! Please follow these steps:

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/AmazingFeature`.
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`.
4. Push to the branch: `git push origin feature/AmazingFeature`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
