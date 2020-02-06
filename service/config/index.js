// mysql 配置
const mysql = {
  database: 'cloud',      // 使用哪个数据库
  username: 'root',       // 用户名
  password: 'root',       // 口令
  host: 'localhost',      // 主机名
  port: 3306              // 端口号，MySQL默认3306
};

//邮件配置（用于重置密码）
const email = {
  service: 'qq',                           // 邮箱类型
  user: '123456@qq.com',                  // 发送的邮箱
  pass: 'amzmwuhoaqz',                   // smtp密码
};

// redis 配置
const redis = {
  port: 6379,             // 端口号
  host: '127.0.0.1'       // 数据库地址
};

// 后台配置
const service ={
  // 存储文件根目录（默认./files或请事先创建好）
  dir: './files'
};

module.exports = {
  mysql,
  email,
  redis,
  service,
};
