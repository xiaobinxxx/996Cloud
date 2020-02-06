// 导入sequelize 框架
const Sequelize = require('sequelize');
// 导入数据库模块
const sequelize = require('../mysql/sequelize');

// 用户表
const ArticlesModel = sequelize.define('articles', {
    article_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,            // 主键
        autoIncrement: true,         // 自动递增
    },
    class_id: Sequelize.INTEGER(11),
    title: Sequelize.STRING(100),
    describe: Sequelize.STRING(100),
    content: Sequelize.STRING(255),
    creation_time: Sequelize.BIGINT(20),
    update_time: Sequelize.BIGINT(20),
}, {
    timestamps: false,
});

module.exports =  ArticlesModel;
