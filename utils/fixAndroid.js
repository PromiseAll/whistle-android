const os = require("os");
const Module = require("module");
const originalCompile = Module.prototype._compile;
const originalRequire = Module.prototype.require;

// Module.prototype.require = function (path) {
//   // 调用原始的 require 方法获取原始的返回值
//   const originalValue = originalRequire.call(this, path);
//   // 禁用capture错误
//   if (path.includes("/config") && originalValue?.name.includes("whistle")) {
//     originalValue.captureData = false;
//   }
//   // 修改返回的值
//   const modifiedValue = originalValue; /* 在这里修改原始的返回值 */
//   return modifiedValue;
// };
// 自定义的编译方法

// // 应用自定义的编译方法
Module.prototype._compile = function (content, filename) {
  // console.log(filename)
  // 检查是否是要修改的模块
  if (filename.includes("tunnel")) {
    // console.log(filename);
    // 修改模块内的 exports.extend 方法
    // console.log(content.includes("emitAborted(data, reqEmitter, 'captureError');"));
    const modifiedCode = content.replace("emitAborted(data, reqEmitter, 'captureError');", "// emitAborted(data, reqEmitter, 'captureError');");
    content = modifiedCode;
  }
  // 调用原始的 _compile 方法
  originalCompile.call(this, content, filename);
};

os.isAndroid = os.platform().includes("android");
if (os.isAndroid) {
  os.homedir = () => "/sdcard";
  os.tmpdir = () => "/sdcard/.temp/";
  // process.env.WHISTLE_PATH = path.join(os.homedir(), "http-handle/WhistleAppData");
}
