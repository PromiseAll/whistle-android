const fs = require("fs-extra");
const path = require("path");
const os = require("os");
async function moveFilesWithWhistle() {
  const sourceDir = "/data/misc/user/0/cacerts-added/";
  const targetDir = "/etc/security/cacerts/";
  try {
    // 读取指定目录下的所有文件
    const files = await fs.readdir(sourceDir);
    // 遍历每个文件
    for (const file of files) {
      const filePath = `${sourceDir}${file}`;
      // 读取文件内容
      const content = await fs.readFile(filePath, "utf-8");
      // 检查内容是否包含 "whistle"
      if (content.includes("whistle")) {
        const targetFilePath = `${targetDir}${file}`;
        // 移动文件到目标目录
        await fs.move(filePath, targetFilePath);
        console.log(`Moved file ${file} to ${targetDir}`);
      }
    }
    console.log("File moving completed.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function copyAssets() {
  const sourceDir = __dirname + "/../assets/.WhistleAppData";
  const targetDir = path.join(os.homedir(), ".WhistleAppData");

  try {
    // 复制源目录到目标目录（包括子文件夹）并覆盖已存在的文件
    await fs.copy(sourceDir, targetDir, {
      overwrite: true
    });

    console.log("Assets copied successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = { moveFilesWithWhistle, copyAssets };
