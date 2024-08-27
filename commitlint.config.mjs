const Configuration = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      ["webview", "communication", "renderer", "docs", "config", "deps"],
    ],
  },
};

export default Configuration;
