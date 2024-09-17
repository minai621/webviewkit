import { VersionedMethodBase } from "@/bridge/Bridge.type";
import { SemverVersion } from "..";

export function compareVersions(
  v1: SemverVersion,
  v2: SemverVersion
): -1 | 0 | 1 {
  if (v1 === "default") return -1;
  if (v2 === "default") return 1;

  const [major1, minor1, patch1] = v1.split(".").map(Number);
  const [major2, minor2, patch2] = v2.split(".").map(Number);

  if (major1 !== major2) return major1 > major2 ? 1 : -1;
  if (minor1 !== minor2) return minor1 > minor2 ? 1 : -1;
  if (patch1 !== patch2) return patch1 > patch2 ? 1 : -1;
  return 0;
}

export function selectBestVersion<T extends VersionedMethodBase>(
  availableVersions: (keyof T & string)[],
  userVersion: SemverVersion
): keyof T & string {
  return availableVersions.reduce(
    (best, current) => {
      if (
        compareVersions(current as SemverVersion, userVersion) <= 0 &&
        compareVersions(current as SemverVersion, best as SemverVersion) > 0
      ) {
        return current;
      }
      return best;
    },
    "default" as keyof T & string
  );
}
