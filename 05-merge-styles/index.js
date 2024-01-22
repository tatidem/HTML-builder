const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

let styles = [];

fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    return;
  }

  files = files.filter((file) => path.extname(file) === '.css');

  files.forEach((file) => {
    fs.readFile(path.join(stylesDir, file), 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${file}: ${err}`);
        return;
      }

      styles.push(data);

      if (styles.length === files.length) {
        fs.writeFile(
          path.join(outputDir, 'bundle.css'),
          styles.join('\n'),
          (err) => {
            if (err) {
              console.error(`Error writing output file: ${err}`);
            } else {
              console.log('Styles successfully compiled to bundle.css');
            }
          },
        );
      }
    });
  });
});
