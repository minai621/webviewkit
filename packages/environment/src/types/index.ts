import { UserAgent } from "@/class/Environment.type";

export interface Detector<T> {
  detect: (userAgent: UserAgent) => T;
}

export interface VersionParser {
  parse: (versionString: string) => string;
}
