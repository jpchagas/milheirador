// Runs after `vite build` and `vite build --ssr src/entry-server.jsx` (see package.json).
// Writes one HTML file per route with the page already rendered and its own <head> data, so
// crawlers (and AdSense review) see the content without running JavaScript, plus sitemap.xml
// and robots.txt. `/ranking` is written as ranking.html, which Cloudflare Pages serves at
// /ranking without a trailing-slash redirect.
import { readFile, rm, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const ssrDir = new URL("../dist-ssr/", import.meta.url);
const { render, routes, SITE_URL, CONTACT_EMAIL } = await import(new URL("entry-server.js", ssrDir));

if (!SITE_URL || !CONTACT_EMAIL) {
  throw new Error("Preencha SITE_URL e CONTACT_EMAIL em src/site.js antes do build.");
}
const siteUrl = SITE_URL.replace(/\/+$/, "");

const escape = text =>
  text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// Replaces `from` exactly once, so a changed index.html fails the build instead of shipping
// pages without their content.
const replaceOnce = (html, from, to) => {
  if (html.split(from).length !== 2) throw new Error(`index.html: "${from}" deve aparecer uma vez.`);
  return html.replace(from, () => to);
};

const template = await readFile(new URL("index.html", dist), "utf8");
const descriptionTag = template.match(/<meta name="description" content="[^"]*" \/>/)?.[0];
if (!descriptionTag) throw new Error('index.html: <meta name="description"> não encontrada.');

for (const route of routes) {
  const url = siteUrl + route.path;
  const head = [
    `<link rel="canonical" href="${escape(url)}" />`,
    route.noindex && '<meta name="robots" content="noindex" />',
  ].filter(Boolean);

  let html = template;
  html = replaceOnce(html, "<title>Milheirador</title>", `<title>${escape(route.title)}</title>`);
  html = replaceOnce(html, descriptionTag, `<meta name="description" content="${escape(route.description)}" />`);
  html = replaceOnce(html, "</head>", `    ${head.join("\n    ")}\n  </head>`);
  html = replaceOnce(html, '<div id="root"></div>', `<div id="root">${render(route.path)}</div>`);

  const file = route.path === "/" ? "index.html" : `${route.path.slice(1)}.html`;
  await writeFile(new URL(file, dist), html);
  console.log(`prerendered ${route.path} -> dist/${file}`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter(route => !route.noindex)
  .map(route => `  <url><loc>${escape(siteUrl + route.path)}</loc></url>`)
  .join("\n")}
</urlset>
`;
await writeFile(new URL("sitemap.xml", dist), sitemap);
await writeFile(new URL("robots.txt", dist), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

await rm(ssrDir, { recursive: true });
