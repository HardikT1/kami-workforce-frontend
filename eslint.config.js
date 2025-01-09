// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/no-empty-lifecycle-method": "error", // Disallow empty lifecycle hooks
      "@angular-eslint/use-injectable-provided-in": "error", // Ensure Injectable uses providedIn

      // General TypeScript best practices
      "@typescript-eslint/no-explicit-any": "warn", // Warn on use of 'any'
      "@typescript-eslint/explicit-function-return-type": "warn", // Require return type for functions
      "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }], // No unused variables
      "@typescript-eslint/no-non-null-assertion": "warn", // Discourage non-null assertions
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"], // Prefer 'interface' over 'type'

      // Code style and readability
      "no-console": "warn", // Avoid console statements
      "no-debugger": "error", // Disallow debugger statements
      "max-len": ["warn", { code: 120 }], // Enforce line length of 120
      "arrow-body-style": ["error", "as-needed"], // Enforce concise arrow function syntax
      "curly": ["error", "all"], // Require braces for all control statements
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/no-positive-tabindex": "error", // Avoid positive tabindex
      "@angular-eslint/template/alt-text": "error", // Require alt text for images
      "@angular-eslint/template/banana-in-box": "error", // Prevent mismatched banana-in-a-box syntax
      "@angular-eslint/template/click-events-have-key-events": "warn", // Ensure click has keyboard events
      "@angular-eslint/template/no-any": "warn", // Discourage use of 'any' in templates
    },
  }
);
