import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel/static";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_NAME = "https://changelog.charleszw.com";

/**
 * @see https://github.com/withastro/astro/issues/3682#issuecomment-1492468918
 */
function contentRoutes() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const contentPath = join(__dirname, "src", "content");
  const changelogPath = join(contentPath, "changelog");
  if (!existsSync(changelogPath)) {
    throw new Error(
      `contentRoutes(): The changelog directory "${changelogPath}" does not exist!\n`,
    );
  }

  const changelogUrls = readdirSync(changelogPath).map((file) => {
    // my version numbering has exactly two periods, so we collect the first three array elements
    const versionPieces = file.split(".").splice(0, 3);
    // remove the "v" because the slug doesn't contain it
    const slug = `${versionPieces[0].slice(1)}.${versionPieces[1]}.${versionPieces[2]}`;
    return `${SITE_NAME}/${slug}`;
  });

  return changelogUrls;
}

const config = defineConfig({
  site: SITE_NAME,
  output: "static",
  adapter: vercel({
    imageService: true,
    imagesConfig: {
      domains: [],
      sizes: [160, 320, 640, 1280, 2560],
    },
    webAnalytics: {
      enabled: true,
    },
  }),
  trailingSlash: "never",
  markdown: {
    shikiConfig: {
      theme: "rose-pine-moon",
    },
  },
  integrations: [
    mdx(),
    sitemap({
      customPages: contentRoutes(),
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});

export default config;

export { SITE_NAME };
