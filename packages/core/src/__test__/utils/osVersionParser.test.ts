// osVersionParser.test.ts
import { UNKNOWN } from "@/constants";
import {
  parseAndroidVersion,
  parseIOSVersion,
  parseMacOSVersion,
  parseWindowsVersion,
} from "@/utils/osVersionParser";

describe("parseWindowsVersion", () => {
  it("should parse Windows version correctly", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(parseWindowsVersion(userAgent)).toBe("10.0");
  });

  it("should return unknown for non-Windows user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(parseWindowsVersion(userAgent)).toBe(UNKNOWN);
  });
});

describe("parseMacOSVersion", () => {
  it("should parse macOS version correctly", () => {
    const userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(parseMacOSVersion(userAgent)).toBe("10.15.7");
  });

  it("should return unknown for non-macOS user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(parseMacOSVersion(userAgent)).toBe(UNKNOWN);
  });
});

describe("parseIOSVersion", () => {
  it("should parse iOS version correctly", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1";
    expect(parseIOSVersion(userAgent)).toBe("14.7.1");
  });

  it("should return unknown for non-iOS user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(parseIOSVersion(userAgent)).toBe(UNKNOWN);
  });
});

describe("parseAndroidVersion", () => {
  it("should parse Android version correctly", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 11; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36";
    expect(parseAndroidVersion(userAgent)).toBe("11");
  });

  it("should return unknown for non-Android user agent", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1";
    expect(parseAndroidVersion(userAgent)).toBe(UNKNOWN);
  });
});
