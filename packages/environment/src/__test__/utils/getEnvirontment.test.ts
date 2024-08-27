import Environment from "@/class/Environment";
import { BROWSER_NAMES, DEVICE_TYPES, OS_NAMES } from "@/constants";
import { getEnvironment } from "@/utils/getEnvirontment";

describe("Library Entry Point", () => {
  it("should export Environment class", () => {
    expect(Environment).toBeDefined();
  });

  it("should export getEnvironment function", () => {
    expect(getEnvironment).toBeDefined();
    expect(typeof getEnvironment).toBe("function");
  });

  it("should export necessary types and constants", () => {
    expect(DEVICE_TYPES).toBeDefined();
    expect(OS_NAMES).toBeDefined();
    expect(BROWSER_NAMES).toBeDefined();
  });

  it("getEnvironment should return an instance of Environment", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    const env = getEnvironment(userAgent);
    expect(env).toBeInstanceOf(Environment);
  });
});
