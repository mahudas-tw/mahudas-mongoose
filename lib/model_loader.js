/* eslint global-require:0, import/no-dynamic-require:0 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const recursiveSearch = (conn, dirPath) => {
  let modules = {};
  if (!fs.existsSync(dirPath)) return modules;

  const directX = fs.readdirSync(dirPath);
  directX.forEach((pName) => {
    const currentPath = path.join(dirPath, pName);
    const targetFS = fs.statSync(currentPath);

    // 如果命名是"-"開頭，就忽略
    if (pName.indexOf('-') === 0) return;

    if (targetFS.isDirectory()) {
      const subModules = recursiveSearch(conn, currentPath);
      modules = { ...modules, ...subModules };
    } else {
      // 如果不是.js檔，就跳過
      if (!/\.js$/.test(pName)) return;
      const mName = pName.replace(/\.js$/, '')
        .replace(/^./, pName[0].toUpperCase());
      modules[mName] = require(currentPath)(conn, mongoose.Schema);
    }
  });
  return modules;
};

const load = (app, conn, modelPath) => {
  // 定義要掃描的目錄名稱，依序掃描並載入
  let scanPath = path.join(app.appInfo.root, 'app/model');
  if (modelPath) {
    scanPath = path.join(app.appInfo.root, modelPath);
    // 如果從root出發找不到這個目錄，有可能是絕對路徑
    if (!fs.existsSync(scanPath)) {
      scanPath = path.resolve(modelPath);
    }
  }
  const models = recursiveSearch(conn, scanPath);
  return models;
};

module.exports = load;
