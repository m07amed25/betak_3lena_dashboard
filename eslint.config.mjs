import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-restricted-syntax": [
        "error",
        {
          "selector": "Literal[value=/(^|\\s)(ml-|mr-|pl-|pr-|left-|right-|text-left|text-right|border-l|border-r|rounded-l-|rounded-r-)/]",
          "message": "Physical direction classes (ml, mr, pl, pr, left, right, etc) are banned in this project. Use logical equivalents (ms, me, ps, pe, start, end)."
        }
      ]
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".agents/**",
  ]),
]);

export default eslintConfig;
