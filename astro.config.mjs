import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import swup from "@swup/astro";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
const isDev = process.env.NODE_ENV !== "production";
const siteUrl =
  process.env.SITE_URL ?? (isDev ? "http://localhost:4321" : "https://example.com");
const basePath = process.env.BASE_PATH ?? "/";

function rehypePrefixContentImages() {
  const normalizedBasePath =
    basePath === "/" ? "" : basePath.replace(/\/$/, "");

  return (tree) => {
    const walk = (node) => {
      if (node?.type === "element" && node.tagName === "img") {
        const src = node.properties?.src;
        if (typeof src === "string" && src.startsWith("/images/content/")) {
          node.properties.src = `${normalizedBasePath}${src}`;
        }
      }

      if (Array.isArray(node?.children)) {
        for (const child of node.children) {
          walk(child);
        }
      }
    };

    walk(tree);
  };
}

function remarkPrefixContentImages() {
  const normalizedBasePath =
    basePath === "/" ? "" : basePath.replace(/\/$/, "");

  return (tree) => {
    const walk = (node) => {
      if (node?.type === "image" && typeof node.url === "string") {
        if (node.url.startsWith("/images/content/")) {
          node.url = `${normalizedBasePath}${node.url}`;
        }
      }

      if (Array.isArray(node?.children)) {
        for (const child of node.children) {
          walk(child);
        }
      }
    };

    walk(tree);
  };
}

export default defineConfig({
  site: siteUrl,
  base: basePath,
  integrations: [
    swup({
      theme: ["overlay", { direction: "to-top" }],
      cache: true,
      progress: true,
    }),
    mdx(),
    preact(),
    sitemap(),
  ],

  markdown: {
    remarkPlugins: [remarkPrefixContentImages],
    rehypePlugins: [rehypePrefixContentImages],
  },

  image: {
    responsiveStyles: true,
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
        interval: 200,
      },
    },
  },

  experimental: {
    svgo: true,
  },
});

//swup theme variations:
// theme: "fade"
// theme: ["overlay", { direction: "to-top"}]
//
// for overlay and fade, further customization can be done in animate.css file
// To know about swup, visit https://swup.js.org/
