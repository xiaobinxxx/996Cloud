// 导入数据库连接配置文件
const config = require('../config/index');
// 导入sequelize模块
const Sequelize = require('sequelize');
// 实例
const Op = Sequelize.Op;

const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
  host: config.mysql.host,
  dialect: 'mysql',
  query: {
    raw: true
  },
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
    operatorsAliases: {
      $and: Op.and,
      $or: Op.or,
      $eq: Op.eq,
      $gt: Op.gt,
      $lt: Op.lt,
      $lte: Op.lte,
      $like: Op.like
    }
  },
});

sequelize.sync(
  [
    {
      force: true
    },
  ],
);
module.exports = sequelize;
