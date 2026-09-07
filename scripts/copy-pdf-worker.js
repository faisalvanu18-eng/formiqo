/**
 * Copies the pdf.js worker from node_modules into /public so it is served as a
 * static asset (referenced by src/lib/formatConvert.ts as "/pdf.worker.min.mjs").
 *
 * Runs automatically before build so fresh deployments always ship a worker
 * that matches the installed pdfjs-dist version. Dependency-free.
 */
const fs = require("fs");
const path = require("path");

const src = path.join(
  __dirname,
  "..",
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.mjs"
);
const destDir = path.join(__dirname, "..", "public");
const dest = path.join(destDir, "pdf.worker.min.mjs");

try {
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log("copied pdf.worker.min.mjs -> public/");
} catch (err) {
  console.error(
    "Failed to copy pdf.js worker. Is pdfjs-dist installed?\n",
    err.message
  );
  process.exit(1);
}
