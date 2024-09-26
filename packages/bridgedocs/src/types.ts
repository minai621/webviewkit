export interface Config {
  include: string | string[];
  exclude: string | string[];
  outDir: string;
  outputFormats: ("markdown" | "json")[];
  tsConfigPath: string;
}

export interface ParsedDocs {
  [interfaceName: string]: InterfaceInfo;
}

export interface InterfaceInfo {
  description: string;
  since?: string;
  members: {
    [methodName: string]: MethodInfo;
  };
}

export interface MethodInfo {
  description: string;
  example?: string;
  versions: {
    [versionName: string]: VersionInfo;
  };
}

export interface VersionInfo {
  description: string;
  since?: string;
  deprecated?: string;
  params: {
    [paramName: string]: ParamInfo;
  };
  result: {
    [propName: string]: PropInfo;
  };
}

export interface ParamInfo {
  type: string;
  description: string;
  optional?: boolean;
}

export interface PropInfo {
  type: string;
  description: string;
  optional?: boolean;
}
