import { ParsedDocs, VersionInfo } from "../types";

export function generateMarkdown(docs: ParsedDocs): string {
  let markdown = "# API Documentation\n\n";

  for (const [interfaceName, interfaceInfo] of Object.entries(docs)) {
    markdown += `## ${interfaceName}\n\n`;
    if (interfaceInfo.description) {
      markdown += `${interfaceInfo.description}\n\n`;
    }
    if (interfaceInfo.since) {
      markdown += `*Available since version ${interfaceInfo.since}*\n\n`;
    }

    for (const [methodName, methodInfo] of Object.entries(
      interfaceInfo.members
    )) {
      markdown += `<details><summary><h3>${methodName}</h3></summary>\n\n`;
      if (methodInfo.description) {
        markdown += `${methodInfo.description}\n\n`;
      }
      markdown += "#### Versions\n\n";

      for (const [versionName, versionInfo] of Object.entries(
        methodInfo.versions
      )) {
        markdown += `<details><summary>Version: ${versionName}</summary>\n\n`;
        if (versionInfo.description) {
          markdown += `${versionInfo.description}\n\n`;
        }
        if (versionInfo.since) {
          markdown += `*Since: ${versionInfo.since}*\n\n`;
        }
        if (versionInfo.deprecated) {
          markdown += `> **Deprecated:** ${versionInfo.deprecated}\n\n`;
        }

        // IEventTypes 처리
        if (interfaceName === "UserEventTypes") {
          markdown += generateEventTypeMarkdown(versionInfo);
        } else {
          markdown += generateRequestResponseMarkdown(versionInfo);
        }

        if (methodInfo.example) {
          markdown += "**Example:**\n";
          markdown += "```typescript\n";
          markdown += `// Web (JavaScript)\n${methodInfo.example}\n`;
          markdown += `// Native (pseudo-code)\n${getNativeExample(methodName, versionInfo, interfaceName === "UserEventTypes")}\n`;
          markdown += "```\n\n";
        }

        markdown += "</details>\n\n";
      }
      markdown += "</details>\n\n";
    }
  }

  return markdown;
}

function getNativeExample(
  methodName: string,
  versionInfo: VersionInfo,
  isEvent: boolean
): string {
  if (isEvent) {
    return `${methodName}();`;
  } else {
    const params = Object.keys(versionInfo.params).join(", ");
    return `${methodName}(${params});`;
  }
}

function generateTableRow(
  name: string,
  type: string,
  optional: boolean,
  description: string
): string {
  const optionalEmoji = optional ? "✅" : "❌";
  const safeType = type.replace(/\|/g, " or ");
  return `| \`${name}\` | \`${safeType}\` | ${optionalEmoji} | ${description || ""} |\n`;
}

function generateEventTypeMarkdown(versionInfo: VersionInfo): string {
  let markdown = "**Event Parameters:**\n\n";
  if (Object.keys(versionInfo.params).length > 0) {
    markdown +=
      "| Parameter | Type | Optional | Description |\n|-----------|------|----------|-------------|\n";
    for (const [paramName, paramInfo] of Object.entries(versionInfo.params)) {
      markdown += generateTableRow(
        paramName,
        paramInfo.type,
        paramInfo.optional as boolean,
        paramInfo.description
      );
    }
    markdown += "\n";
  } else {
    markdown += "No parameters.\n\n";
  }
  return markdown;
}

function generateRequestResponseMarkdown(versionInfo: VersionInfo): string {
  let markdown = "**Request:**\n\n";
  if (Object.keys(versionInfo.params).length > 0) {
    markdown +=
      "| Parameter | Type | Optional | Description |\n|-----------|------|----------|-------------|\n";
    for (const [paramName, paramInfo] of Object.entries(versionInfo.params)) {
      markdown += generateTableRow(
        paramName,
        paramInfo.type,
        paramInfo.optional as boolean,
        paramInfo.description
      );
    }
    markdown += "\n";
  } else {
    markdown += "No parameters required.\n\n";
  }

  markdown += "**Response:**\n\n";
  if (Object.keys(versionInfo.result).length > 0) {
    markdown +=
      "| Property | Type | Optional | Description |\n|----------|------|----------|-------------|\n";
    for (const [propName, propInfo] of Object.entries(versionInfo.result)) {
      markdown += generateTableRow(
        propName,
        propInfo.type,
        propInfo.optional as boolean,
        propInfo.description
      );
    }
    markdown += "\n";
  } else {
    markdown += "No response data.\n\n";
  }

  return markdown;
}
