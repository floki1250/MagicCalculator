// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here
  // disable eslint/indent
  {
    // @ts-ignore
    indent: 0,
  }
);
