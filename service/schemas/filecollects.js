// 导入sequelize 框架
const Sequelize = require('sequelize');
// 导入数据库模块
const sequelize = require('../mysql/sequelize');

// 用户表
const CollectModel = sequelize.define('filecollect', {
  CollectId: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,            // 主键
    autoIncrement: true,         // 自动递增
  },
  ino: Sequelize.STRING(50),
  url: Sequelize.STRING(255),
  fileName: Sequelize.STRING,
  CollectDate: Sequelize.BIGINT,
  MemberId: Sequelize.INTEGER(11),
  type: Sequelize.INTEGER(11),
},{
  timestamps: false,
});

module.exports = CollectModel;
