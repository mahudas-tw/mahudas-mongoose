const mongooseCon = require('./lib/mongoose_con');

module.exports = (app) => {
  // 當config被載入後就開始進行連線
  app.on('configDidLoad', () => {
    mongooseCon.createConnect(app);
  });

  // 離開app時切斷連線
  app.on('beforeClose', async () => {
    await mongooseCon.disconnect();
  });
};
