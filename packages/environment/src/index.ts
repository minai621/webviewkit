import Environment from "./class/Environment";
import {
  BrowserInfo,
  DeviceInfo,
  EnvironmentInfo,
  OSInfo,
  UserAgent,
} from "./class/Environment.type";
import { getEnvironment } from "./utils/getEnvirontment";

import { BROWSER_NAMES, DEVICE_TYPES, OS_NAMES } from "./constants";

export type { BrowserInfo, DeviceInfo, EnvironmentInfo, OSInfo, UserAgent };

export { BROWSER_NAMES, DEVICE_TYPES, Environment, OS_NAMES, getEnvironment };
