const crypto = require("crypto");
const tls = require("tls");
const path = require("path");

function getRootCertificateDirectory() {
  let certDir;

  if (process.platform === "win32") {
    const certConfig = crypto.constants.SSL_CERT_DIR;
    const envCertDir = process.env[certConfig];

    if (envCertDir) {
      certDir = envCertDir;
    } else {
      const userDir = process.env.USERPROFILE;
      certDir = path.join(userDir, "AppData", "LocalLow", "Microsoft", "CryptnetUrlCache", "MetaData");
    }
  } else {
    throw new Error("只支持 Windows 操作系统。");
  }

  return certDir;
}

function getTrustedCACertificates() {
  let caRootCertificates;

  if (process.platform === "win32") {
    const certConfig = crypto.constants.OPENSSL_CONF;
    const envCertConfig = process.env[certConfig];

    if (envCertConfig) {
      const configLines = require("fs").readFileSync(envCertConfig, "utf8").split("\n");
      const caSectionIndex = configLines.findIndex(line => line.trim().startsWith("######## Extra"));
      const caLines = configLines.slice(caSectionIndex + 1).filter(line => line.trim().startsWith("openssl.cafile"));

      if (caLines.length > 0) {
        const caFilePath = caLines[0].split("=")[1].trim();
        caRootCertificates = require("fs").readFileSync(caFilePath, "utf8");
      }
    }
  } else {
    const caStore = tls.getRootCAStore();
    caRootCertificates = caStore && caStore.exportPEM();
  }

  return caRootCertificates;
}

// 测试
const rootCertDir = getRootCertificateDirectory();
console.log("根证书目录:", rootCertDir);

const trustedCACertificates = getTrustedCACertificates();
console.log("受信任的根证书颁发机构目录:", trustedCACertificates);
