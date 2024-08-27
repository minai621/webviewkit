import { UNKNOWN, VERSION_PATTERNS } from "@/constants";

export const parseChromeVersion = (userAgent: string): string => {
  const match = userAgent.match(VERSION_PATTERNS.CHROME);
  return match ? match[1] : UNKNOWN;
};

export const parseFirefoxVersion = (userAgent: string): string => {
  const match = userAgent.match(VERSION_PATTERNS.FIREFOX);
  return match ? match[1] : UNKNOWN;
};

export const parseSafariVersion = (userAgent: string): string => {
  const match = userAgent.match(VERSION_PATTERNS.SAFARI);
  return match ? match[1] : UNKNOWN;
};

export const parseInternetExplorerVersion = (userAgent: string): string => {
  const match = userAgent.match(VERSION_PATTERNS.IE);
  return match ? match[1] : UNKNOWN;
};
