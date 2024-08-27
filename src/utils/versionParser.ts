import { UNKNOWN } from "@/constants";
import { VersionParser } from "@/types";

export const parseVersion: VersionParser = {
  parse: (versionString: string): string => {
    if (!versionString) return UNKNOWN;

    const cleaned = versionString.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");

    if (parts.length === 0 || (parts.length === 1 && parts[0] === "")) {
      return "0.0";
    }

    return parts
      .slice(0, 2)
      .concat(Array(Math.max(0, 2 - parts.length)).fill("0"))
      .join(".");
  },
};

export const extractVersion = (userAgent: string, pattern: RegExp): string => {
  const match = userAgent.match(pattern);
  return match ? parseVersion.parse(match[1]) : UNKNOWN;
};
