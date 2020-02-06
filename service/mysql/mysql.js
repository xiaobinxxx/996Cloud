// 导入Mysql数据库
const mysql = require('mysql');
// 导入数据库连接配置文件
const config = require('../config/index');

// createConnection(那台数据库，用户名，密码，库)
const db = mysql.createConnection({
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.username,
  password: config.mysql.password,
  database: config.mysql.database
});

// 用户表
db.query('SELECT 1 FROM members LIMIT 1;', (err, data) => {
  if (err) {
    console.log('创建表中...');
    db.query('CREATE TABLE `members` (\n' +
      '  `MemberId` int(11) NOT NULL AUTO_INCREMENT COMMENT \'用户id\',\n' +
      '  `UserName` varchar(26) COLLATE utf8_bin NOT NULL COMMENT \'用户账号\',\n' +
      '  `Password` varchar(255) COLLATE utf8_bin NOT NULL COMMENT \'用户密码\',\n' +
      '  `CreatedAt` bigint(20) NOT NULL COMMENT \'注册时间\',\n' +
      '  `UpdateAt` bigint(20) NOT NULL COMMENT \'更新时间\',\n' +
      '  `nickname` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT \'无昵称\' COMMENT \'用户昵称\',\n' +
      '  `avatar` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT \'""\' COMMENT \'用户头像\',\n' +
      '  `email` varchar(50) COLLATE utf8_bin NOT NULL COMMENT \'用户邮箱\',\n' +
      '  PRIMARY KEY (`MemberId`)\n' +
      ') ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT=\'用户表\';');
  }
});

// 收藏表
db.query('SELECT 1 FROM filecollects LIMIT 1;', (err, data) => {
  if (err) {
    db.query('CREATE TABLE `filecollects` (\n' +
      '  `CollectId` int(11) NOT NULL AUTO_INCREMENT COMMENT \'收藏id\',\n' +
      '  `ino` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT \'ino(标识id)\',\n' +
      '  `url` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT \'文件路径\',\n' +
      '  `fileName` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT \'文件名\',\n' +
      '  `CollectDate` bigint(20) DEFAULT NULL COMMENT \'收藏时间\',\n' +
      '  `MemberId` int(11) DEFAULT NULL COMMENT \'用户id\',\n' +
      '  `type` int(11) DEFAULT NULL COMMENT \'文件类型 0 文件 1 文件夹\',\n' +
      '  UNIQUE KEY `CollectId` (`CollectId`)\n' +
      ') ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT=\'收藏表\';');
  }
});

// 分享表
db.query('SELECT 1 FROM file_shares LIMIT 1;', (err, data) => {
  if (err) {
    db.query('CREATE TABLE `file_shares` (\n' +
      '  `ShareId` int(11) NOT NULL AUTO_INCREMENT COMMENT \'分享id\',\n' +
      '  `StartTime` bigint(20) DEFAULT NULL COMMENT \'分享开始时间\',\n' +
      '  `EndTime` bigint(20) DEFAULT NULL COMMENT \'分享结束时间\',\n' +
      '  `ShareUrl` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT \'分享的链接\',\n' +
      '  `ShareOne` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT \'分享的人\',\n' +
      '  `MemberId` int(11) DEFAULT NULL COMMENT \'分享用户id\',\n' +
      '  `ino` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT \'分享文件ino(标识id)\',\n' +
      '  `url` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT \'分享文件真实路径\',\n' +
      '  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT \'分享的文件真实名字\',\n' +
      '  `password` varchar(50) COLLATE utf8_bin NOT NULL COMMENT \'文件密码\',\n' +
      '  `type` int(11) DEFAULT NULL COMMENT \'文件类型 0 文件 1 文件夹\',\n' +
      '  `isPrivacy` int(11) DEFAULT NULL COMMENT \'是否是私密链接 1 是 2 否\',\n' +
      '  `isExpiry` int(11) DEFAULT \'2\' COMMENT \'是否过期 1 是 2 否\',\n' +
      '  PRIMARY KEY (`ShareId`)\n' +
      ') ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT=\'分享表\';');
    console.log('创建完毕');
  }
});
