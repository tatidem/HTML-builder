const fs = require('fs').promises;
const path = require('path');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    if (entry.isDirectory()) {
      await copyDir(path.join(src, entry.name), path.join(dest, entry.name));
    } else {
      await fs.copyFile(
        path.join(src, entry.name),
        path.join(dest, entry.name),
      );
    }
  }
}

copyDir(srcPath, destPath)
  .then(() => console.log('Files were copied'))
  .catch(console.error);
