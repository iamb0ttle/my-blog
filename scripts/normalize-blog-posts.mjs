import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const blogDir = path.resolve("src/content/blogs");
const files = (await readdir(blogDir)).filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Missing frontmatter block");
  }
  return { frontmatter: match[1], body: match[2] };
}

function parseScalar(raw) {
  const value = raw.trim();
  if (!value) return "";
  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value);
  }
  return value;
}

function parseTags(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  return JSON.parse(trimmed.replace(/'/g, '"'));
}

function extractValue(lines, key) {
  const prefix = `${key}:`;
  const line = lines.find((entry) => entry.startsWith(prefix));
  if (!line) return undefined;
  return line.slice(prefix.length).trim();
}

function rebuildFrontmatter(lines) {
  const title = parseScalar(extractValue(lines, "title") ?? "");
  const description = extractValue(lines, "description") ?? extractValue(lines, "excerpt");
  const pubDate = extractValue(lines, "pubDate") ?? extractValue(lines, "date");
  const author = extractValue(lines, "author") ?? '"병현"';
  const tagsRaw = extractValue(lines, "tags");
  const image = extractValue(lines, "image") ?? extractValue(lines, "featuredImage");
  const draft = extractValue(lines, "draft");

  const output = [];
  output.push(`title: ${JSON.stringify(title)}`);
  if (description) output.push(`description: ${JSON.stringify(parseScalar(description))}`);
  if (pubDate) output.push(`pubDate: ${JSON.stringify(parseScalar(pubDate))}`);
  output.push(`author: ${JSON.stringify(parseScalar(author))}`);
  if (tagsRaw) output.push(`tags: ${JSON.stringify(parseTags(tagsRaw))}`);
  if (image) output.push(`image: ${JSON.stringify(parseScalar(image))}`);
  if (draft) output.push(`draft: ${draft}`);
  return output.join("\n");
}

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const original = await readFile(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(original);
  const lines = frontmatter.split(/\r?\n/).filter(Boolean);
  const rewritten = `---\n${rebuildFrontmatter(lines)}\n---\n${body}`;
  if (rewritten !== original) {
    await writeFile(filePath, rewritten, "utf8");
    console.log(`updated ${file}`);
  }
}
