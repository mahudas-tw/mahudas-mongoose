# @mahudas/mongoose
Mongoose plugin for Mahudas.

## Dependencies
+ mahudas^0.0.3
+ mongoose^6.7.2

## 使用
### Standalone
```console
npm i
npm run mahudas
```

### As a plugin
如同一般的plugin，透過npm安裝之後，在Application的plugin.env.js裡設定啟用。  

```console
npm i @mahudas/mongoose -s
```
```js
// config/plugin.deafult.js
module.exports = {
  mongoose: {
    enable: true,
    package: '@mahudas/mongoose',
  },
}
```

## 設定
```js
// config/config.default.js
module.exports = {
  mongoose: {
    uri: 'mongodb-connection-string',
    options: {
      maxPoolSize: 10,
      minPoolSize: 1,
      autoIndex: true,
      autoCreate: true,
      socketTimeoutMS: 30000,
    },
    modelDir: 'app/model',
  }
}
```
參數 | 說明
--- | ---
uri | 連線MongoDB的字串
options | (非必須) mongoose的參數，可直接參考mongoose文件
modelDir | model放置的目錄，系統會去掃描這個目錄之下的所有檔案與子目錄，若是檔案或目錄開頭是dash(-)，則會被忽略不掃描

### 多資料庫連線
@mahudas/mongoose 也可以允許多個MongoDB的連線，只要把config裡的mongoose改成陣列就可以：
(需注意兩個資料庫的modelDir通常會是不同路徑)
```js
// config/config.default.js
module.exports = {
  mongoose: [
    {
      uri: 'first one',
      modelDir: 'app/model/first',
    },
    {
      uri: 'second one',
      modelDir: 'app/model/second',
    }
  ]
}
```

## model的寫法
接收conn與Schema兩個參數，回傳model。
```js
module.exports = (conn, Schema) => {
  const schema = new Schema({
    email: { type: String, index: true },
  });

  const model = conn.model('users', schema);
  return model;
}
```

## 取用model
@mahudas/mongoose 針對 application 與 context 進行了擴充，可以透過app.mongoose 或 ctx.mongoose 進行操作。  
model被載入後，會被儲存在mongoose.models裡，命名則是與model的命名一致，例如有個model是：
```js
const model = conn.model('users', schema);
```
則可以用以下方式取得model：
```js
const Users = app.mongoose.models.users;
await Users.findOne({});
```

### 多個資料庫連線的情況
如果有多個資料庫連線，基本上每個connection都會被儲存在mongoose.connections裡，這是一個陣列。  
因此，如果要存取第二個資料庫的model：
```js
const Users = app.mongoose.connections[1].models.users;
await Users.findOne({});
```