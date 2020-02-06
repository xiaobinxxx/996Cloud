// 加载redis模块
const redis   = require('redis');
// 加载配置文件
const config = require('../config/index');
// 连接redis
const client  = redis.createClient(config.redis.port, config.redis.host);

// redis 链接错误
client.on("error", function(error) {
  console.log('连接错误：'+error);
});


module.exports = client;
