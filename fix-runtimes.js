const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles || [];
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const folders = ['./app', './src/app'];
let allFiles = [];
folders.forEach(f => {
    allFiles = allFiles.concat(getAllFiles(f));
});

allFiles.forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.tsx')) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes("runtime = 'edge'")) {
      console.log('Updating:', file);
      content = content.replace(/runtime = 'edge'/g, "runtime = 'nodejs'");
      fs.writeFileSync(file, content, 'utf8');
    }
  }
});
