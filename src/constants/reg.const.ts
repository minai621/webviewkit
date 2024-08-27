export const REG_EXP = {
  WINDOWS: /Windows/i,
  MACOS: /Mac OS X/i,
  IOS: /iOS/i,
  ANDROID: /Android/i,
  LINUX: /Linux/i,
  CHROME: /Chrome/i,
  FIREFOX: /Firefox/i,
  SAFARI: /Safari/i,
  IE: /MSIE|Trident/i,
  EDGE: /Edge/i,
  OPERA: /Opera|OPR/i,
  MOBILE: /Mobile/i,
  TABLET: /Tablet/i,
  IPAD: /iPad/i,
  IPHONE: /iPhone/i,
  WEBVIEW: /WebView|wv/i,
} as const;

export const VERSION_PATTERNS = {
  WINDOWS: /Windows NT (\d+\.\d+)/,
  MACOS: /Mac OS X (\d+[._]\d+)/,
  IOS: /OS (\d+_\d+)/,
  ANDROID: /Android (\d+\.\d+)/,
  CHROME: /Chrome\/(\d+\.\d+)/,
  FIREFOX: /Firefox\/(\d+\.\d+)/,
  SAFARI: /Version\/(\d+\.\d+)/,
  IE: /(?:MSIE |rv:)(\d+\.\d+)/,
} as const;
