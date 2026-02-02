const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  if (dirPath.includes('node_modules') || dirPath.includes('.next') || dirPath.includes('.git')) return arrayOfFiles || [];
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

const folders = ['./src', './app'];
let allFiles = [];
folders.forEach(f => {
    allFiles = allFiles.concat(getAllFiles(f));
});

console.log('--- RELATÓRIO DE SEGURANÇA (AUDITORIA MAYCON) ---');
allFiles.forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.tsx')) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('"use client"') && (content.includes('from "@/lib/db"') || content.includes('import { db }'))) {
      console.log('🚨 PERIGO:', file, '- Importando DB no Cliente!');
    }
  }
});
console.log('------------------------------------------------');
