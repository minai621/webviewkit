import Environment from "@/class/Environment";
import { EnvironmentInfo, UserAgent } from "@/class/Environment.type";

export function getEnvironment(userAgent: UserAgent): EnvironmentInfo {
  return new Environment(userAgent);
}
