import { UNKNOWN } from "@/constants";
import { extractVersion, parseVersion } from "@/utils/versionParser";

describe("parseVersion", () => {
  it("should parse valid version strings", () => {
    expect(parseVersion.parse("1.2.3")).toBe("1.2");
    expect(parseVersion.parse("10.0")).toBe("10.0");
    expect(parseVersion.parse("5")).toBe("5.0");
  });

  it("should handle version strings with non-numeric characters", () => {
    expect(parseVersion.parse("1.2.3-beta")).toBe("1.2");
    expect(parseVersion.parse("v10.0.1")).toBe("10.0");
  });

  it('should return "Unknown" for empty strings and "0.0" for invalid version strings', () => {
    expect(parseVersion.parse("")).toBe(UNKNOWN);
    expect(parseVersion.parse("invalid")).toBe("0.0");
  });
});

describe("extractVersion", () => {
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

  it("should extract and parse version from user agent string", () => {
    expect(extractVersion(userAgent, /Chrome\/(\d+\.\d+)/)).toBe("91.0");
    expect(extractVersion(userAgent, /Firefox\/(\d+\.\d+)/)).toBe(UNKNOWN);
  });

  it("should handle cases where version is not found", () => {
    expect(extractVersion(userAgent, /Opera\/(\d+\.\d+)/)).toBe(UNKNOWN);
  });
});
