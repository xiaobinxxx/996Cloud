// 导入sequelize 框架
const Sequelize = require('sequelize');
// 导入数据库模块
const sequelize = require('../mysql/sequelize');

// 用户表
const ShareModel = sequelize.define('file_share', {
  ShareId: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,            // 主键
    autoIncrement: true,         // 自动递增
  },
  StartTime: Sequelize.BIGINT(20),
  EndTime: Sequelize.BIGINT(20),
  ShareUrl: Sequelize.STRING(255),
  ShareOne: Sequelize.STRING(50),
  MemberId: Sequelize.INTEGER(11),
  ino: Sequelize.STRING(255),
  url: Sequelize.STRING(255),
  name: Sequelize.STRING(255),
  password: Sequelize.STRING(50),
  type: Sequelize.INTEGER(11),
  isPrivacy: Sequelize.INTEGER(11),
  isExpiry: Sequelize.INTEGER(11),
},{
  timestamps: false,
});

module.exports = ShareModel;
