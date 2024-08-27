import { detectBrowser } from "@/detectors/browserDetector";
import { detectDevice } from "@/detectors/deviceDetector";
import { detectOS } from "@/detectors/osDetector";
import { detectWebView } from "@/detectors/webviewDetector";
import {
  BrowserInfo,
  DeviceInfo,
  EnvironmentInfo,
  OSInfo,
  UserAgent,
} from "./Environment.type";

class Environment {
  private _env: EnvironmentInfo;

  constructor(private userAgent: UserAgent) {
    this._env = this.detectEnvironment(userAgent);
  }

  private detectEnvironment(userAgent: UserAgent): EnvironmentInfo {
    return {
      os: detectOS(userAgent),
      browser: detectBrowser(userAgent),
      device: detectDevice(userAgent),
      isWebView: detectWebView(userAgent),
    };
  }

  get os(): OSInfo {
    return this._env.os;
  }

  get browser(): BrowserInfo {
    return this._env.browser;
  }

  get device(): DeviceInfo {
    return this._env.device;
  }

  get isWebView(): boolean {
    return this._env.isWebView;
  }

  get isDesktop(): boolean {
    return this.device.type === "desktop";
  }

  get isMobile(): boolean {
    return this.device.type === "mobile" || this.device.type === "tablet";
  }

  get isWebBrowser(): boolean {
    return !this.isWebView;
  }

  public toString(): string {
    return `Environment(OS: ${this.os.name} ${this.os.version}, Browser: ${this.browser.name} ${this.browser.version}, Device: ${this.device.type})`;
  }
}

export default Environment;
