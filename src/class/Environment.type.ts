export type UserAgent = string;

export interface OSInfo {
  name: string;
  version: string;
  platform?: string;
}

export interface BrowserInfo {
  name: string;
  version: string;
  engine?: string;
}

export interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop" | "tv" | "unknown";
  model?: string;
  vendor?: string;
}

export interface EnvironmentInfo {
  os: OSInfo;
  browser: BrowserInfo;
  device: DeviceInfo;
  isWebView: boolean;
}
