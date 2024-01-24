const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');

fs.mkdir(outputDir, { recursive: true })
  .then(() => fs.readdir(stylesDir))
  .then((files) => {
    files = files.filter((file) => path.extname(file) === '.css');
    return Promise.all(
      files.map((file) => fs.readFile(path.join(stylesDir, file), 'utf8')),
    );
  })
  .then((styles) =>
    fs.writeFile(path.join(outputDir, 'bundle.css'), styles.join('\n')),
  )
  .then(() => {
    console.log('Styles successfully compiled to bundle.css');
  })
  .catch((err) => {
    console.error(err);
  });
