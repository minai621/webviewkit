import { glob } from "glob";
import path from "path";

export async function getFiles(
  include: string | string[],
  exclude: string | string[]
): Promise<string[]> {
  const patterns = Array.isArray(include)
    ? include.map((pattern) => path.join(pattern, "**", "*.ts"))
    : [path.join(include, "**", "*.ts")];

  try {
    const files = await Promise.all(
      patterns.map((pattern) => glob(pattern, { ignore: exclude }))
    );
    return files.flat();
  } catch (error) {
    console.error("Error in getFiles:", error);
    throw error;
  }
}
