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
    const os = this.detectOS(userAgent);
    const browser = this.detectBrowser(userAgent);
    const device = this.detectDevice(userAgent);
    const isWebView = this.detectWebView(userAgent);

    return {
      os,
      browser,
      device,
      isWebView,
    };
  }

  private detectOS(userAgent: UserAgent): OSInfo {
    if (/Windows/i.test(userAgent)) {
      const version =
        userAgent.match(/Windows NT (\d+\.\d+)/)?.[1] || "Unknown";
      return { name: "Windows", version };
    } else if (/Mac OS X/i.test(userAgent)) {
      const version =
        userAgent.match(/Mac OS X (\d+[._]\d+)/)?.[1].replace("_", ".") ||
        "Unknown";
      return { name: "macOS", version };
    } else if (/Android/i.test(userAgent)) {
      const version = userAgent.match(/Android (\d+\.\d+)/)?.[1] || "Unknown";
      return { name: "Android", version };
    } else if (/iOS/i.test(userAgent)) {
      const version =
        userAgent.match(/OS (\d+_\d+)/)?.[1].replace("_", ".") || "Unknown";
      return { name: "iOS", version };
    } else if (/Linux/i.test(userAgent)) {
      return { name: "Linux", version: "Unknown" };
    }
    return { name: "Unknown", version: "Unknown" };
  }

  private detectBrowser(userAgent: UserAgent): BrowserInfo {
    if (/Chrome/i.test(userAgent)) {
      const version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || "Unknown";
      return { name: "Chrome", version };
    } else if (/Firefox/i.test(userAgent)) {
      const version = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || "Unknown";
      return { name: "Firefox", version };
    } else if (/Safari/i.test(userAgent)) {
      const version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || "Unknown";
      return { name: "Safari", version };
    } else if (/MSIE|Trident/i.test(userAgent)) {
      const version =
        userAgent.match(/(?:MSIE |rv:)(\d+\.\d+)/)?.[1] || "Unknown";
      return { name: "Internet Explorer", version };
    }
    return { name: "Unknown", version: "Unknown" };
  }

  private detectDevice(userAgent: UserAgent): DeviceInfo {
    if (/Mobile/i.test(userAgent)) {
      if (/iPad/i.test(userAgent)) {
        return { type: "tablet" };
      } else if (/iPhone/i.test(userAgent)) {
        return { type: "mobile" };
      }
      return { type: "mobile" };
    } else if (/Tablet/i.test(userAgent)) {
      return { type: "tablet" };
    } else if (/Android/i.test(userAgent)) {
      return { type: "mobile" };
    } else if (/Windows Phone/i.test(userAgent)) {
      return { type: "mobile" };
    }
    return { type: "desktop" };
  }

  private detectWebView(userAgent: UserAgent): boolean {
    return /WebView|wv/i.test(userAgent);
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
