import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = __dirname;
const CDN_PREFIX = "https://img.m167cw.com";

const FILE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".html",
  ".json"
]);

const downloaded = new Set();

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function extractUrls(content) {
  const regex = new RegExp(`${CDN_PREFIX}[^"'\\s)]+`, "g");
  return content.match(regex) || [];
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const relativePath = new URL(url).pathname;
    const localPath = path.join(PROJECT_ROOT, relativePath);

    if (downloaded.has(url) || fs.existsSync(localPath)) {
      downloaded.add(url);
      return resolve();
    }

    fs.mkdirSync(path.dirname(localPath), { recursive: true });

    https.get(url, res => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${url} (${res.statusCode})`));
      }

      const file = fs.createWriteStream(localPath);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        downloaded.add(url);
        console.log("Downloaded:", localPath);
        resolve();
      });
    }).on("error", reject);
  });
}

async function main() {
  const files = walk(PROJECT_ROOT);
  const urls = new Set();

  for (const file of files) {
    if (!FILE_EXTENSIONS.has(path.extname(file))) continue;

    const content = fs.readFileSync(file, "utf8");
    extractUrls(content).forEach(url => urls.add(url));
  }

  console.log(`Found ${urls.size} image URLs`);

  for (const url of urls) {
    try {
      await downloadImage(url);
    } catch (err) {
      console.error("Error:", err.message);
    }
  }

  console.log("Done ✅");
}

main();
