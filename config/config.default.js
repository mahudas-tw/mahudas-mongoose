const config = {
  mongoose: [
    {
      uri: '',
      options: {
        maxPoolSize: 10,
        minPoolSize: 1,
        autoIndex: true,
        autoCreate: true,
        socketTimeoutMS: 30000,
      },
      modelDir: 'app/model',
    },
  ],
};

module.exports = config;
