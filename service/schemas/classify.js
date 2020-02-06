// 导入sequelize 框架
const Sequelize = require('sequelize');
// 导入数据库模块
const sequelize = require('../mysql/sequelize');
// 导入文章表
const ArticlesModel = require('./contents');
// 分类表
const ClassModel = sequelize.define('classifys', {
    class_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,            // 主键
        autoIncrement: true,         // 自动递增
    },
    class_name: Sequelize.STRING(100),
}, {
    timestamps: false,
});
// ArticlesModel.hasMany(ClassModel,{foreignKey:'class_id'});
// ClassModel.belongsTo(ArticlesModel,{foreignKey:'class_id'});
module.exports =  ClassModel;
