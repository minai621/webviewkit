import { SemverVersion } from "..";

export function compareVersions(v1: SemverVersion, v2: SemverVersion): number {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}

export function findBestHandlerVersion<T>(
  handlers: Record<string, T>,
  currentVersion: SemverVersion
): SemverVersion | "default" {
  const versions = Object.keys(handlers).filter(
    (v) => v !== "default"
  ) as SemverVersion[];
  versions.sort((a, b) => compareVersions(b, a));

  for (const version of versions) {
    if (compareVersions(currentVersion, version) >= 0) {
      return version;
    }
  }

  return "default";
}
