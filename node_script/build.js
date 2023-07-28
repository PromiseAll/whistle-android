const { spawnSync } = require("node:child_process");
const fs = require("fs-extra");
const { resolve } = require("path");
fs.removeSync(resolve("dist"));
console.log("删除成功 dist/");
spawnSync("npx", ["ncc", "build", "start/index.js", "-o", "dist/", "-C"], { shell: true, stdio: "inherit" });
