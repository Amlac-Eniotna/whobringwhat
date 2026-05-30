import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    // Ignore all files in lib/generated directory
    ignores: ["lib/generated/**/*"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // App entièrement en français : les apostrophes/guillemets typographiques
      // sont omniprésents dans les textes. Inutile d'échapper chaque entité JSX.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
