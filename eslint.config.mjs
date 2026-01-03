import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default defineConfig([
  {
    files: ["**/*.ts"],
    plugins: { "@typescript-eslint": tseslint },
    languageOptions: {
      parser: parser,
      globals: globals.node
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      semi: "error"
    }
  }
]);
