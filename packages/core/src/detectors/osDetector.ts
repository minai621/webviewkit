// osDetector.ts
import { OSInfo, UserAgent } from "@/class/Environment.type";
import { OS_NAMES, REG_EXP, UNKNOWN } from "@/constants";
import {
  parseAndroidVersion,
  parseIOSVersion,
  parseMacOSVersion,
  parseWindowsVersion,
} from "@/utils/osVersionParser";

export function detectOS(userAgent: UserAgent): OSInfo {
  if (REG_EXP.WINDOWS.test(userAgent)) {
    return {
      name: OS_NAMES.WINDOWS,
      version: parseWindowsVersion(userAgent),
    };
  }

  if (REG_EXP.IOS.test(userAgent)) {
    return {
      name: OS_NAMES.IOS,
      version: parseIOSVersion(userAgent),
    };
  }

  if (REG_EXP.MACOS.test(userAgent)) {
    return {
      name: OS_NAMES.MACOS,
      version: parseMacOSVersion(userAgent),
    };
  }

  if (REG_EXP.ANDROID.test(userAgent)) {
    return {
      name: OS_NAMES.ANDROID,
      version: parseAndroidVersion(userAgent),
    };
  }

  if (REG_EXP.LINUX.test(userAgent)) {
    return {
      name: OS_NAMES.LINUX,
      version: UNKNOWN,
    };
  }

  return {
    name: UNKNOWN,
    version: UNKNOWN,
  };
}
