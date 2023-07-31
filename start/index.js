require("../utils/fixAndroid");
const chalk = require("chalk");
const startWhistle = require("whistle");
const { moveFilesWithWhistle, copyAssets } = require("../utils/files");

function start(debugMode = false) {
  console.log(`启动模式:${chalk.green(debugMode ? "debug" : "prod")}`);
  startWhistle({
    // baseDir: "/sdcard/http-handle/whistle",
    // socksPort: 8900,
    mode: `capture${debugMode ? "" : "|prod"}`,
    // customPluginsPath: __dirname + "/",
    // customPluginsPath: "./",
    // debugMode: !os.isAndroid,
    debugMode
  });
}
const args = process.argv.slice(2);
const debugMode = args[0] === "prod" ? false : true;

copyAssets()
  .then(() => {
    start(debugMode);
    console.log(`代理服务器:${chalk.green("http://127.0.0.1:8899")}`);
  })
  .catch(err => {
    console.log("发生错误...");
    console.error(err);
  });

module.exports = start;
