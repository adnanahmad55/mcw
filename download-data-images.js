// download-data-images.mjs
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcFolder = path.join(__dirname, 'src', 'assets', 'data'); // JSON root
const publicImagesFolder = path.join(__dirname, 'public', 'dataImages'); // images root
const MAX_CONCURRENT_DOWNLOADS = 10; // parallel downloads

// Download a single image
function downloadImage(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) return resolve(); // skip if exists
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed to download ${url}: ${res.statusCode}`);
        return resolve();
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(resolve));
    }).on('error', (err) => {
      console.error(`Error downloading ${url}:`, err.message);
      resolve();
    });
  });
}

// Collect all image download tasks
async function collectImageTasks(obj, folderPath, tasks = []) {
  if (Array.isArray(obj)) {
    for (let item of obj) await collectImageTasks(item, folderPath, tasks);
  } else if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (key === 'showIcon' || key === 'iconUrl') {
        const url = obj[key];
        if (!url) continue;
        const fileName = path.basename(url.split('?')[0]);
        const localPath = path.join(folderPath, fileName);
        const relativePath = `/dataImages/${path.relative(publicImagesFolder, localPath).replace(/\\/g, '/')}`;
        obj[key] = relativePath; // update JSON
        tasks.push({ url, dest: localPath });
      } else {
        await collectImageTasks(obj[key], folderPath, tasks);
      }
    }
  }
  return tasks;
}

// Process a single JSON file
async function processJsonFile(filePath, subFolder) {
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const folderPath = path.join(publicImagesFolder, subFolder);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  const tasks = await collectImageTasks(jsonData, folderPath);

  for (let i = 0; i < tasks.length; i += MAX_CONCURRENT_DOWNLOADS) {
    const batch = tasks.slice(i, i + MAX_CONCURRENT_DOWNLOADS);
    await Promise.all(batch.map(t => downloadImage(t.url, t.dest)));
  }

  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  console.log(`Updated JSON and downloaded images for: ${filePath}`);
}

// Recursively find JSON files
function getJsonFiles(dir, parentFolder = '') {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getJsonFiles(fullPath, path.join(parentFolder, file)));
    } else if (file.endsWith('.json')) {
      files.push({ path: fullPath, folder: parentFolder });
    }
  });
  return files;
}

// Main
(async () => {
  const jsonFiles = getJsonFiles(srcFolder);
  for (let { path: filePath, folder } of jsonFiles) {
    await processJsonFile(filePath, folder);
  }
  console.log('All JSON files processed and images downloaded.');
})();
