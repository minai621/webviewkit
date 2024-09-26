import * as fs from "fs";
import * as path from "path";
import { Config } from "../types";
import { getFiles } from "../utils/files";
import { generateMarkdown } from "./markdown";
import { parseTypeScriptFiles } from "./parser";

export async function generateDocs(config: Config): Promise<void> {
  const files = await getFiles(config.include, config.exclude);
  const parsedDocs = parseTypeScriptFiles(files, config.tsConfigPath);

  if (!fs.existsSync(config.outDir)) {
    fs.mkdirSync(config.outDir, { recursive: true });
  }

  if (config.outputFormats.includes("json")) {
    const jsonOutput = JSON.stringify(parsedDocs, null, 2);
    fs.writeFileSync(path.join(config.outDir, "api-docs.json"), jsonOutput);
  }

  if (config.outputFormats.includes("markdown")) {
    const markdownOutput = generateMarkdown(parsedDocs);
    fs.writeFileSync(path.join(config.outDir, "api-docs.md"), markdownOutput);
  }

  console.log("Documentation generated successfully!");
}
