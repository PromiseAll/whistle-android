require("../utils/fixAndroid");
const startWhistle = require("whistle");
const { moveFilesWithWhistle, copyAssets } = require("../utils/files");

function start(params) {
  startWhistle({
    // baseDir: "/sdcard/http-handle/whistle",
    // socksPort: 8900,
    // mode: "debug",
    mode: "capture|prod|notAllowedDisableRules|notAllowedDisablePlugins"
    // customPluginsPath: __dirname + "/",
    // customPluginsPath: "./",
    // debugMode: !os.isAndroid
  });
}
copyAssets()
  .then(() => {
    start();
    console.log("启动代理成功:http://127.0.0.1:8899");
  })
  .catch(err => {
    console.log("发生错误...");
    console.error(err);
  });
module.exports = start;
