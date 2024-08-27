import { UNKNOWN } from "../constants";

export const parseWindowsVersion = (userAgent: string): string => {
  const match = userAgent.match(/Windows NT (\d+\.\d+)/);
  return match ? match[1] : UNKNOWN;
};

export const parseMacOSVersion = (userAgent: string): string => {
  const match = userAgent.match(/Mac OS X (\d+(?:[._]\d+)+)/);
  return match ? match[1].replace(/_/g, ".") : UNKNOWN;
};

export const parseIOSVersion = (userAgent: string): string => {
  const match = userAgent.match(/OS (\d+(?:[._]\d+)*)/);
  return match ? match[1].replace(/_/g, ".") : UNKNOWN;
};

export const parseAndroidVersion = (userAgent: string): string => {
  const match = userAgent.match(/Android\s+(\d+(?:\.\d+)*)/);
  return match ? match[1] : UNKNOWN;
};
