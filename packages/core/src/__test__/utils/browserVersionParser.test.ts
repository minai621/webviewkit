import { UNKNOWN } from "../../constants";
import {
  parseChromeVersion,
  parseFirefoxVersion,
  parseInternetExplorerVersion,
  parseSafariVersion,
} from "../../utils/browserVersionParser";

describe("parseChromeVersion", () => {
  it("should parse Chrome version correctly", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(parseChromeVersion(userAgent)).toBe("93.0");
  });

  it("should return unknown for non-Chrome user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0";
    expect(parseChromeVersion(userAgent)).toBe(UNKNOWN);
  });
});

describe("parseFirefoxVersion", () => {
  it("should parse Firefox version correctly", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0";
    expect(parseFirefoxVersion(userAgent)).toBe("92.0");
  });

  it("should return unknown for non-Firefox user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(parseFirefoxVersion(userAgent)).toBe(UNKNOWN);
  });
});

describe("parseSafariVersion", () => {
  it("should parse Safari version correctly", () => {
    const userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15";
    expect(parseSafariVersion(userAgent)).toBe("14.1");
  });

  it("should return unknown for non-Safari user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(parseSafariVersion(userAgent)).toBe(UNKNOWN);
  });
});

describe("parseInternetExplorerVersion", () => {
  it("should parse Internet Explorer version correctly", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko";
    expect(parseInternetExplorerVersion(userAgent)).toBe("11.0");
  });

  it("should return unknown for non-Internet Explorer user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(parseInternetExplorerVersion(userAgent)).toBe(UNKNOWN);
  });
});
