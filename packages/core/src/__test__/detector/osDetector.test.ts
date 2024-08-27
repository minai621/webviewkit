import { OS_NAMES, UNKNOWN } from "../../constants";
import { detectOS } from "../../detectors/osDetector";

describe("detectOS", () => {
  it("should detect Windows", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(detectOS(userAgent)).toEqual({
      name: OS_NAMES.WINDOWS,
      version: "10.0",
    });
  });

  it("should detect macOS", () => {
    const userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(detectOS(userAgent)).toEqual({
      name: OS_NAMES.MACOS,
      version: "10.15.7",
    });
  });

  it("should detect iOS", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1";
    expect(detectOS(userAgent)).toEqual({
      name: OS_NAMES.IOS,
      version: "14.7.1",
    });
  });

  it("should detect Android", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 11; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36";
    expect(detectOS(userAgent)).toEqual({
      name: OS_NAMES.ANDROID,
      version: "11",
    });
  });

  it("should detect Linux", () => {
    const userAgent =
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";
    expect(detectOS(userAgent)).toEqual({
      name: OS_NAMES.LINUX,
      version: UNKNOWN,
    });
  });

  it("should return unknown for unrecognized OS", () => {
    const userAgent =
      "Mozilla/5.0 (Nintendo Switch; WebApplet) AppleWebKit/601.6 (KHTML, like Gecko) NF/4.0.0.5.10 NintendoBrowser/5.1.0.13343";
    expect(detectOS(userAgent)).toEqual({ name: UNKNOWN, version: UNKNOWN });
  });
});
