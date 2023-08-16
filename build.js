const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const buildDir = path.join(__dirname, "build");

function compressFolders() {
  const folderA = path.join(__dirname, "template");
  const folderB = __dirname;
  const outputZip = path.join(__dirname, `build/${process.env.npm_package_name}-${process.env.npm_package_version}.zip`);

  const archive = archiver("zip", { zlib: { level: 9 } });
  const output = fs.createWriteStream(outputZip);

  archive.pipe(output);

  // 添加文件夹A中的文件
  const filesInFolderA = getAllFilesInDirectory(folderA);
  for (const file of filesInFolderA) {
    const relativePath = path.relative(folderA, file);
    archive.file(file, { name: relativePath });
  }

  // 添加文件夹B中的文件
  const filesInFolderB = getAllFilesInDirectory(folderB);
  for (const file of filesInFolderB) {
    const relativePath = path.relative(folderB, file);
    if (!file.includes(".git")) {
      // 排除.git文件夹
      archive.file(file, { name: path.join("system/bin/node_modules/whistle-android", relativePath) });
    }
  }

  archive.finalize();
}

function getAllFilesInDirectory(directory) {
  const files = [];

  function traverseDirectory(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  traverseDirectory(directory);
  return files;
}

function clearBuildDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      const filePath = path.join(dirPath, file);

      if (fs.lstatSync(filePath).isDirectory()) {
        clearBuildDir(filePath); // 递归清空子目录
        fs.rmdirSync(filePath); // 移除目录
      } else {
        fs.unlinkSync(filePath); // 删除文件
      }
    });
  }
}
clearBuildDir(buildDir);
compressFolders();

// const fflate = require("fflate");
// const fs = require("fs");
// const path = require("path");
// // console.log(process);
// const buildDir = path.join(__dirname, "build");
// function compressFolders() {
//   const folderA = path.join(__dirname, "template");
//   const folderB = __dirname;
//   const outputZip = path.join(__dirname, `build/${process.env.npm_package_name}-${process.env.npm_package_version}.zip`);

//   const zip = {};

//   // Add files from folder A
//   const filesInFolderA = getAllFilesInDirectory(folderA);
//   for (const file of filesInFolderA) {
//     const content = fs.readFileSync(file);
//     const relativePath = path.relative(folderA, file);
//     zip[relativePath] = new Uint8Array(content);
//   }

//   // Add files from folder B
//   const filesInFolderB = getAllFilesInDirectory(folderB);
//   for (const file of filesInFolderB) {
//     const content = fs.readFileSync(file);
//     const relativePath = path.relative(folderB, file);
//     const zipPath = path.join("system/bin/node_modules/whistle-android", relativePath);
//     if (!file.includes(".git")) {
//       // Exclude .git folder
//       zip[zipPath] = new Uint8Array(content);
//     }
//   }

//   const zipBuffer = fflate.zipSync (zip, {
//     // mem: 0
//   });
//   fs.writeFileSync(outputZip, zipBuffer);
// }

// function getAllFilesInDirectory(directory) {
//   const files = [];

//   function traverseDirectory(currentDir) {
//     const entries = fs.readdirSync(currentDir, { withFileTypes: true });

//     for (const entry of entries) {
//       const fullPath = path.join(currentDir, entry.name);

//       if (entry.isDirectory()) {
//         traverseDirectory(fullPath);
//       } else if (entry.isFile()) {
//         files.push(fullPath);
//       }
//     }
//   }

//   traverseDirectory(directory);

//   return files;
// }

// // Remove all files and directories inside the build directory
// const clearBuildDir = dirPath => {
//   if (fs.existsSync(dirPath)) {
//     fs.readdirSync(dirPath).forEach(file => {
//       const filePath = path.join(dirPath, file);

//       if (fs.lstatSync(filePath).isDirectory()) {
//         clearBuildDir(filePath); // Recursively clear subdirectories
//         fs.rmdirSync(filePath); // Remove directory
//       } else {
//         fs.unlinkSync(filePath); // Remove file
//       }
//     });
//   }
// };
// clearBuildDir(buildDir);
// compressFolders();
