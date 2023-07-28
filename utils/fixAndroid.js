const os = require("os");
os.isAndroid = os.platform().includes("android");
if (os.isAndroid) {
  os.homedir = () => "/sdcard";
  os.tmpdir = () => "/sdcard/.temp/";
  // process.env.WHISTLE_PATH = path.join(os.homedir(), "http-handle/WhistleAppData");
}
