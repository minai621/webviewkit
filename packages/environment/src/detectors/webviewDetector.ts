import { UserAgent } from "@/class/Environment.type";
import { REG_EXP } from "@/constants";

export function detectWebView(userAgent: UserAgent): boolean {
  if (REG_EXP.WEBVIEW.test(userAgent)) {
    return true;
  }

  if (REG_EXP.IOS.test(userAgent) && !REG_EXP.SAFARI.test(userAgent)) {
    return true;
  }

  if (REG_EXP.ANDROID.test(userAgent) && REG_EXP.WEBVIEW.test(userAgent)) {
    return true;
  }

  return false;
}
