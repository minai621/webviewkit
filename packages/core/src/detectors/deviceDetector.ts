import { DeviceInfo, UserAgent } from "@/class/Environment.type";
import { DEVICE_TYPES, REG_EXP } from "@/constants";

export function detectDevice(userAgent: UserAgent): DeviceInfo {
  if (REG_EXP.TABLET.test(userAgent) || REG_EXP.IPAD.test(userAgent)) {
    return { type: DEVICE_TYPES.TABLET };
  }

  if (REG_EXP.MOBILE.test(userAgent)) {
    return { type: DEVICE_TYPES.MOBILE };
  }

  if (REG_EXP.TV.test(userAgent)) {
    return { type: DEVICE_TYPES.TV };
  }

  if (REG_EXP.ANDROID.test(userAgent) && !REG_EXP.MOBILE.test(userAgent)) {
    return { type: DEVICE_TYPES.TABLET };
  }

  return { type: DEVICE_TYPES.DESKTOP };
}
