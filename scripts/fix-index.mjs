import { readFileSync, writeFileSync, cpSync, rmSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";

const cwd = process.cwd();
const outDir = join(cwd, "out");

// 1. Fix out/index.html with meta refresh
const indexPath = join(outDir, "index.html");
let html = readFileSync(indexPath, "utf-8");
const metaRefresh = '<meta http-equiv="refresh" content="0;url=/whitychen903.github.io/zh/">\n';
html = html.replace("</head>", metaRefresh + "</head>");
writeFileSync(indexPath, html);
console.log("✅ Fixed out/index.html with meta refresh");

// 2. Sync out/ contents to repo root for GitHub Pages (deploys from / root)
// Source code directories to NOT delete from root
const keepDirs = new Set([
  "src", "public", "scripts", "node_modules", "out",
  ".git", ".codebuddy", ".next"
]);
const keepFiles = new Set([
  "package.json", "package-lock.json", "tsconfig.json",
  "next.config.ts", "tailwind.config.ts", "postcss.config.mjs",
  "components.json", "eslint.config.mjs", ".gitignore", ".nojekyll",
  "README.md", ".env.local", "PLAN.md", "PRD-v2.0.md", "PRD-v3.0.md"
]);

// Remove old deployed files from root (but keep source files)
const rootEntries = readdirSync(cwd);
for (const entry of rootEntries) {
  if (keepDirs.has(entry) || keepFiles.has(entry)) continue;
  const fullPath = join(cwd, entry);
  try {
    rmSync(fullPath, { recursive: true, force: true });
  } catch (e) {
    // ignore
  }
}

// Copy out/ contents to root
copyDirSync(outDir, cwd);
console.log("✅ Synced out/ to repo root for GitHub Pages deployment");

function copyDirSync(src, dest) {
  if (!existsSync(src)) return;
  const entries = readdirSync(src);
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      if (!existsSync(destPath)) mkdirSync(destPath, { recursive: true });
      copyDirSync(srcPath, destPath);
    } else {
      cpSync(srcPath, destPath, { force: true });
    }
  }
}
