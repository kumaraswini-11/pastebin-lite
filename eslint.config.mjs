import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
    rules: {
      "react/no-children-prop": ["error", { allowFunctions: true }],

      // Import order rule from eslint-plugin-import
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js built-in modules
            "external", // All installed dependencies (npm packages)
            "internal", // Custom aliases like '@/components'
            "parent", // ../
            "sibling", // ./
            "index", // .
            "object", // Added common default groups
            "unknown", // This is where the CSS import falls if not explicitly handled
          ],
          // NEW CRITICAL SECTION: Defines how aliases starting with @/ are handled
          pathGroups: [
            {
              pattern: "@/**", // Targets all paths starting with @/
              group: "internal", // Assigns them to the 'internal' group
              position: "before", // Optional: ensures this pattern is prioritized
            },
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          // Add this to allow side-effect imports (like CSS) to be recognized and placed
          // It's often required when you have unassigned imports like "import 'styles.css';"
          pathGroupsExcludedImportTypes: ["builtin", "external"],
        },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "components/ui/**",
  ]),
]);

export default eslintConfig;
