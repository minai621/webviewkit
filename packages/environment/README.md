# @webviewkit/environment

@webviewkit/environment is a lightweight TypeScript library for detecting and analyzing user environments, including operating systems, browsers, and devices. It's particularly useful for identifying WebView environments.

## Installation

```bash
npm install @webviewkit/environment
# or
yarn add @webviewkit/environment
# or
pnpm add @webviewkit/environment
```

## Usage

Here's a basic example of how to use @webviewkit/environment:

```typescript
import { getEnvironment } from "@webviewkit/environment";

const userAgent = navigator.userAgent;
const env = getEnvironment(userAgent);

console.log(`OS: ${env.os.name} ${env.os.version}`);
console.log(`Browser: ${env.browser.name} ${env.browser.version}`);
console.log(`Device type: ${env.device.type}`);
console.log(`Is WebView: ${env.isWebView}`);
console.log(`Is Mobile: ${env.isMobile}`);
```

## API

### `getEnvironment(userAgent: string): Environment`

Creates and returns an `Environment` object based on the provided user agent string.

### `Environment` class

The `Environment` class provides the following properties and methods:

- `os`: `{ name: string, version: string }`
- `browser`: `{ name: string, version: string }`
- `device`: `{ type: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'unknown' }`
- `isWebView`: `boolean`
- `isDesktop`: `boolean`
- `isMobile`: `boolean`
- `isWebBrowser`: `boolean`
- `toString()`: Returns a string representation of the environment.

### Constants

@webviewkit/environment also exports the following constants:

- `DEVICE_TYPES`: Available device types
- `OS_NAMES`: Available OS names
- `BROWSER_NAMES`: Available browser names

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
