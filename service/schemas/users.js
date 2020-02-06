// 导入sequelize 框架
const Sequelize = require('sequelize');
// 导入数据库模块
const sequelize = require('../mysql/sequelize');

// 用户表
const UserModel = sequelize.define('member', {
  MemberId: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,            // 主键
    autoIncrement: true,         // 自动递增
  },
  UserName: Sequelize.STRING(26),
  Password: Sequelize.STRING(255),
  CreatedAt: Sequelize.BIGINT(20),
  UpdateAt: Sequelize.BIGINT(20),
  nickname: Sequelize.STRING(50),
  avatar: Sequelize.STRING(255),
  email: Sequelize.STRING(50),
},{
  timestamps: false,
});

module.exports = UserModel;
