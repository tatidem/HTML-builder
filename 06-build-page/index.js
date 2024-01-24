const fs = require('fs').promises;
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const distPath = path.join(__dirname, 'project-dist');

// копирования файлов
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

fs.mkdir(distPath, { recursive: true })
  .then(() => fs.readFile(templatePath, 'utf8'))
  .then((template) => {
    // чтение components
    return fs.readdir(componentsPath).then((files) => {
      files = files.filter((file) => path.extname(file) === '.html');

      let promises = files.map((file) =>
        fs.readFile(path.join(componentsPath, file), 'utf8'),
      );

      return Promise.all(promises).then((components) => {
        components.forEach((component, i) => {
          let tagName = path.basename(files[i], '.html');
          let regex = new RegExp(`{{${tagName}}}`, 'g');
          template = template.replace(regex, component);
        });

        // запись измененного шаблона в файл index.html
        return fs.writeFile(path.join(distPath, 'index.html'), template);
      });
    });
  })
  .then(() => {
    return fs.readdir(stylesPath);
  })
  .then((files) => {
    // фильтрация файлов с расширением .css
    files = files.filter((file) => path.extname(file) === '.css');

    // объединение стилей в 1 файл
    let promises = files.map((file) =>
      fs.readFile(path.join(stylesPath, file), 'utf8'),
    );

    return Promise.all(promises).then((styles) => {
      return fs.writeFile(path.join(distPath, 'style.css'), styles.join('\n'));
    });
  })
  .then(() => {
    // копирование папки assets в папку project-dist
    return copyDir(assetsPath, path.join(distPath, 'assets'));
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
