import Environment from "@/class/Environment";
import { BROWSER_NAMES, DEVICE_TYPES, OS_NAMES } from "@/constants";

describe("Environment", () => {
  it("should detect desktop environment correctly", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    const env = new Environment(userAgent);

    expect(env.os.name).toBe(OS_NAMES.WINDOWS);
    expect(env.browser.name).toBe(BROWSER_NAMES.CHROME);
    expect(env.device.type).toBe(DEVICE_TYPES.DESKTOP);
    expect(env.isWebView).toBe(false);
    expect(env.isDesktop).toBe(true);
    expect(env.isMobile).toBe(false);
    expect(env.isWebBrowser).toBe(true);
  });

  it("should detect mobile environment correctly", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";
    const env = new Environment(userAgent);

    expect(env.os.name).toBe(OS_NAMES.IOS);
    expect(env.browser.name).toBe(BROWSER_NAMES.SAFARI);
    expect(env.device.type).toBe(DEVICE_TYPES.MOBILE);
    expect(env.isWebView).toBe(false);
    expect(env.isDesktop).toBe(false);
    expect(env.isMobile).toBe(true);
    expect(env.isWebBrowser).toBe(true);
  });

  it("should detect WebView environment correctly", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.93 Mobile Safari/537.36 WebView";
    const env = new Environment(userAgent);

    expect(env.os.name).toBe(OS_NAMES.ANDROID);
    expect(env.browser.name).toBe(BROWSER_NAMES.CHROME);
    expect(env.device.type).toBe(DEVICE_TYPES.MOBILE);
    expect(env.isWebView).toBe(true);
    expect(env.isDesktop).toBe(false);
    expect(env.isMobile).toBe(true);
    expect(env.isWebBrowser).toBe(false);
  });

  it("should return correct string representation", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    const env = new Environment(userAgent);

    expect(env.toString()).toBe(
      "Environment(OS: Windows 10.0, Browser: Chrome 91.0, Device: desktop)"
    );
  });
});
