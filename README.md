# WebViewKit

WebViewKit is a collection of TypeScript libraries designed to enhance and simplify the development of applications that utilize WebView technology. Our goal is to provide developers with powerful tools to detect, analyze, optimize, and bridge communication in their WebView-based applications.

## Packages

WebViewKit currently consists of the following packages:

### [@webviewkit/environment](./packages/environment)

A lightweight TypeScript library for detecting and analyzing user environments, including operating systems, browsers, and devices. It's particularly useful for identifying WebView environments.

[![npm version](https://badge.fury.io/js/%40webviewkit%2Fenvironment.svg)](https://badge.fury.io/js/%40webviewkit%2Fenvironment)

#### Features:

- Accurate detection of operating systems, browsers, and device types
- Specialized WebView detection
- TypeScript support with comprehensive type definitions
- Easy-to-use API for retrieving environment information

For more details, check out the [@webviewkit/environment README](./packages/environment/README.md).

### [@webviewkit/bridge](./packages/bridge)

A flexible and type-safe TypeScript library for facilitating communication between WebView and native platforms in hybrid mobile applications.

[![npm version](https://badge.fury.io/js/%40webviewkit%2Fbridge.svg)](https://badge.fury.io/js/%40webviewkit%2Fbridge)

#### Features:

- Type-safe communication between WebView and native platforms
- Intelligent version-aware API handling
- Support for iOS, Android, and React Native
- Customizable error handling
- Flexible request and response handlers
- Automatic selection of the most appropriate handler based on semantic versioning

For more details, check out the [@webviewkit/bridge README](./packages/bridge/README.md).

## Getting Started

To get started with WebViewKit, you can install the packages you need using npm, yarn, or pnpm:

```bash
npm install @webviewkit/environment @webviewkit/bridge
# or
yarn add @webviewkit/environment @webviewkit/bridge
# or
pnpm add @webviewkit/environment @webviewkit/bridge
```

## Contributing

We welcome contributions to WebViewKit! If you're interested in contributing, please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the code style of the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions, feel free to reach out or open an issue in the GitHub repository.

---

Happy coding with WebViewKit!
