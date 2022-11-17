/* eslint no-console:0 */
const mongoose = require('mongoose');
const modelLoader = require('./model_loader');

const listenEvents = (connIndex) => {
  const conn = mongoose.connections[connIndex];
  conn.on('error', (err) => {
    console.log('\x1b[34m%s\x1b[0m', `[mongoose] conn-${connIndex} Error`);
    console.log('\x1b[34m%s\x1b[0m', err);
  });
  conn.on('connected', () => {
    console.log('\x1b[32m%s\x1b[0m', `[mongoose] conn-${connIndex} connected`);
  });
  conn.on('disconnected', () => {
    console.log('\x1b[33m%s\x1b[0m', `[mongoose] conn-${connIndex} disconnected`);
  });
};

// 依照config檔建立連線
const createConnect = (app) => {
  let config = app.config.mongoose;
  if (!Array.isArray(config)) config = [config];
  config.forEach((v1, index) => {
    // 每呼叫一次mongoose.createConnect，mongoose.connections數量會+1
    // mongoose.connections一開始的長度就是1
    // 所以如果是第一個連線，要使用mongoose.connect
    // mongoose會自動把它放入到mongoose.connections陣列裡的第一個
    // 其他的連線則使用mongoose.createConnect，往後堆疊
    if (index === 0) {
      mongoose.connect(v1.uri, v1.options);
    } else {
      mongoose.createConnection(v1.uri, v1.options);
    }
    // 取得connection並給予事件監聽，並且建立model
    const conn = mongoose.connections[index];
    listenEvents(index);
    modelLoader(conn, v1.modelDir);
  });
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('\x1b[34m%s\x1b[0m', '[mongoose] Mongoose destroyed');
  } catch (e) {
    console.log('\x1b[34m%s\x1b[0m', '[mongoose] Mongoose destroy Error');
    console.log('\x1b[34m%s\x1b[0m', e);
  }
};

module.exports = {
  createConnect,
  disconnect,
};
