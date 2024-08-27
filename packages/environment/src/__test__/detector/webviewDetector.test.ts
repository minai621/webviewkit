import { detectWebView } from "@/detectors/webviewDetector";

describe("detectWebView", () => {
  it("should detect generic WebView", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Mobile Safari/537.36 WebView";
    expect(detectWebView(userAgent)).toBe(true);
  });

  it("should detect iOS WebView", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
    expect(detectWebView(userAgent)).toBe(true);
  });

  it("should detect Android WebView", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.93 Mobile Safari/537.36 wv";
    expect(detectWebView(userAgent)).toBe(true);
  });

  it("should not detect regular browser as WebView", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    expect(detectWebView(userAgent)).toBe(false);
  });

  it("should not detect Safari on iOS as WebView", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";
    expect(detectWebView(userAgent)).toBe(false);
  });
});
