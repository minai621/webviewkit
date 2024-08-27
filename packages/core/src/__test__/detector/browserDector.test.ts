import { BROWSER_NAMES, UNKNOWN } from "../../constants";
import { detectBrowser } from "../../detector/browserDetector";

describe("detectBrowser", () => {
  it("should detect Chrome browser", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(detectBrowser(userAgent)).toEqual({
      name: BROWSER_NAMES.CHROME,
      version: "93.0",
    });
  });

  it("should detect Firefox browser", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0";
    expect(detectBrowser(userAgent)).toEqual({
      name: BROWSER_NAMES.FIREFOX,
      version: "92.0",
    });
  });

  it("should detect Safari browser", () => {
    const userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15";
    expect(detectBrowser(userAgent)).toEqual({
      name: BROWSER_NAMES.SAFARI,
      version: "14.1",
    });
  });

  it("should detect Internet Explorer browser", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko";
    expect(detectBrowser(userAgent)).toEqual({
      name: BROWSER_NAMES.IE,
      version: "11.0",
    });
  });

  it("should return unknown for unrecognized browser", () => {
    const userAgent =
      "Mozilla/5.0 (Nintendo Switch; WebApplet) AppleWebKit/601.6 (KHTML, like Gecko) NF/4.0.0.5.10 NintendoBrowser/5.1.0.13343";
    expect(detectBrowser(userAgent)).toEqual({
      name: UNKNOWN,
      version: UNKNOWN,
    });
  });
});
