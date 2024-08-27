import { DEVICE_TYPES } from "@/constants";
import { detectDevice } from "@/detectors/deviceDetector";

describe("detectDevice", () => {
  it("should detect mobile device", () => {
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";
    expect(detectDevice(userAgent)).toEqual({ type: DEVICE_TYPES.MOBILE });
  });

  it("should detect tablet device", () => {
    const userAgent =
      "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";
    expect(detectDevice(userAgent)).toEqual({ type: DEVICE_TYPES.TABLET });
  });

  it("should detect desktop device", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    expect(detectDevice(userAgent)).toEqual({ type: DEVICE_TYPES.DESKTOP });
  });

  it("should detect TV device", () => {
    const userAgent =
      "Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.2 Chrome/63.0.3239.84 TV Safari/537.36";
    expect(detectDevice(userAgent)).toEqual({ type: DEVICE_TYPES.TV });
  });

  it("should detect Android tablet", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36";
    expect(detectDevice(userAgent)).toEqual({ type: DEVICE_TYPES.TABLET });
  });
});
