const fs = require('fs').promises;
const path = require('path');

async function displayFileInfo() {
  const directoryPath = path.join(__dirname, 'secret-folder');
  const files = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(directoryPath, file.name);
      const stats = await fs.stat(filePath);
      const fileSizeInKB = stats.size / 1024;
      const fileExtension = path.extname(file.name).slice(1);
      const fileName = path.basename(file.name, `.${fileExtension}`);
      console.log(`${fileName}-${fileExtension}-${fileSizeInKB}kb`);
    }
  }
}

displayFileInfo().catch(console.error);
