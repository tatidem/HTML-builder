const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const distPath = path.join(__dirname, 'project-dist');

if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

// копирования файлов
async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });

  const entries = await fsp.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    if (entry.isDirectory()) {
      await copyDir(path.join(src, entry.name), path.join(dest, entry.name));
    } else {
      await fsp.copyFile(
        path.join(src, entry.name),
        path.join(dest, entry.name),
      );
    }
  }
}

let template = fs.readFileSync(templatePath, 'utf8');

// чтение components
let files;
readdir(componentsPath)
  .then((_files) => {
    files = _files.filter((file) => path.extname(file) === '.html');

    let promises = files.map((file) =>
      readFile(path.join(componentsPath, file), 'utf8'),
    );

    return Promise.all(promises);
  })
  .then((components) => {
    components.forEach((component, i) => {
      let tagName = path.basename(files[i], '.html');
      let regex = new RegExp(`{{${tagName}}}`, 'g');
      template = template.replace(regex, component);
    });

    // запись измененного шаблона в файл index.html
    return writeFile(path.join(distPath, 'index.html'), template);
  })
  .then(() => {
    return readdir(stylesPath);
  })
  .then((_files) => {
    // фильтрация файлов с расширением .css
    files = _files.filter((file) => path.extname(file) === '.css');

    // объединение стилей в 1 файл
    let styles = [];
    files.forEach((file) => {
      fs.readFile(path.join(stylesPath, file), 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file ${file}: ${err}`);
          return;
        }

        styles.push(data);

        if (styles.length === files.length) {
          fs.writeFile(
            path.join(distPath, 'style.css'),
            styles.join('\n'),
            (err) => {
              if (err) {
                console.error(`Error writing output file: ${err}`);
              }
            },
          );
        }
      });
    });
  })
  .then(() => {
    // копирование папки assets в папку project-dist
    return copyDir(assetsPath, path.join(distPath, 'assets'));
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
