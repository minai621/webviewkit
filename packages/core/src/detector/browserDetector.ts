import { BrowserInfo, UserAgent } from "../class/Environment.type";
import { BROWSER_NAMES, REG_EXP, UNKNOWN } from "../constants";
import {
  parseChromeVersion,
  parseFirefoxVersion,
  parseInternetExplorerVersion,
  parseSafariVersion,
} from "../utils/browserVersionParser";

export function detectBrowser(userAgent: UserAgent): BrowserInfo {
  if (REG_EXP.CHROME.test(userAgent)) {
    return {
      name: BROWSER_NAMES.CHROME,
      version: parseChromeVersion(userAgent),
    };
  }

  if (REG_EXP.FIREFOX.test(userAgent)) {
    return {
      name: BROWSER_NAMES.FIREFOX,
      version: parseFirefoxVersion(userAgent),
    };
  }

  if (REG_EXP.SAFARI.test(userAgent) && !REG_EXP.CHROME.test(userAgent)) {
    return {
      name: BROWSER_NAMES.SAFARI,
      version: parseSafariVersion(userAgent),
    };
  }

  if (REG_EXP.IE.test(userAgent)) {
    return {
      name: BROWSER_NAMES.IE,
      version: parseInternetExplorerVersion(userAgent),
    };
  }

  return {
    name: UNKNOWN,
    version: UNKNOWN,
  };
}
