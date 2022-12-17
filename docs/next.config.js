import withNextra from "nextra";

const withNextraConfig = withNextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.js",
});

export default withNextraConfig();
