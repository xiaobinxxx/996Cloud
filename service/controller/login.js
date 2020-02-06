// 加载工具
const util = require('../tool/util');
// 加载加密文件
const encryption = require('../tool/encryption');
// 加载token文件
const user = require('../tool/token');
// 加载用户表
var UserModel = require('../schemas/users');
// 加载redis 连接模型
const client = require('../redis/index');
const Md5 =require("md5");

/**
 * redis 同步取值
 * @param key
 * @returns {Promise<any>}
 * @constructor
 */
let RedisSync = async(key)=>{
  let doc = await new Promise( (resolve) => {
    client.get(key,function(err, res){
      return resolve(res);
    });
  });
  return JSON.parse(doc);
};
// function Cache() {}
//
// let text = async(key)=>{
//   let doc = await new Promise( (resolve) => {
//     client.get(key,function(err, res){
//       return resolve(res);
//     });
//   });
//   return JSON.parse(doc);
// };
//
// Cache.set = function(key, value) {
//   value = JSON.stringify(value);
//   return client.set(key, value, function(err){
//     if (err) {
//       console.error(err);
//     }
//   });
// };
//
// Cache.get = async(key)=>{
//   return await text(key);
// };
//
// Cache.expire = function(key, time) {
//   return client.expire(key, time);
// };

/**
 * 用户登录
 * @param ctx
 * @returns {Promise<void>}
 */
exports.login = async ctx => {
  let UserName = ctx.request.body.UserName || '';
  let PassWord = ctx.request.body.PassWord || '';

  if(!UserName){
    ctx.body = {
      code: 0,
      status: -1,
      message: '用户名不可为为空',
    };
    return;
  }
  if(!PassWord){
    ctx.body = {
      code: 0,
      status: -1,
      message: '密码不可为为空',
    };
    return;
  }
  if(!await UserModel.findOne({})){
    ctx.body = {
      code: 0,
      status: -100,
      message: '您还没有账户，快去注册一个吧',
    };
    return;
  }
  let UserInfo = await UserModel.findOne({
    where:{
      UserName,
      Password:Md5(PassWord),
    }
  });

  if(!UserInfo){
    ctx.body = {
      code: 0,
      status: -1,
      message: '账号或密码错误',
    };
    return;
  }

  let token = user.getPayload({MemberId: UserInfo.MemberId,UserName: UserInfo.UserName});
  // 存储用户token
  client.set(`login_${UserInfo.UserName}`,token);
  // 设置时间 一个小时过期时间（和token一致）
  client.expire(`login_${UserInfo.UserName}`, 3600);
  // 设置token 头
  ctx.set('token', token);
  // 发送数据
  ctx.body = {
    code: 0,
    status: 0,
    result: {
      nickname: UserInfo.nickname,
      UserName: UserInfo.UserName,
    },
    message: '成功',
  }
};

/**
 * 用户注册
 * @param ctx
 * @returns {Promise<void>}
 */
exports.register = async ctx => {
  let UserName = ctx.request.body.UserName || '';
  let PassWord = ctx.request.body.PassWord || '';
  let ConfirmPassword = ctx.request.body.ConfirmPassword || '';
  let nickname = ctx.request.body.nickname || '';
  let email = ctx.request.body.email || '';
  //
  let EmailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  if(!UserName){
    ctx.body = {
      code: 0,
      status: -1,
      message: '用户名不可为为空',
    };
    return;
  }
  if(!PassWord){
    ctx.body = {
      code: 0,
      status: -1,
      message: '密码不可为为空',
    };
    return;
  }
  if(PassWord != ConfirmPassword){
    ctx.body = {
      code: 0,
      status: -1,
      message: '两次密码不一致',
    };
    return;
  }
  if(!nickname){
    ctx.body = {
      code: 0,
      status: -1,
      message: '昵称不可为空',
    };
    return;
  }
  if(!EmailReg.test(email)){
    ctx.body = {
      code: 0,
      status: -1,
      message: '邮箱不正确',
    };
    return
  }
  try {
    let UserInfo = await UserModel.findOne({});
    if(UserInfo){
      ctx.body = {
        code: 0,
        status: -2,
        message: '已有用户，如忘记密码请通过邮箱找回',
      };
      return;
    }
    // 注册用户
    await UserModel.create({
      UserName: UserName,
      Password: Md5(PassWord),
      CreatedAt: parseInt(new Date().getTime() / 1000),
      UpdateAt: parseInt(new Date().getTime() / 1000),
      nickname: nickname,
      email: email,
    });
    ctx.body = {
      code: 0,
      status: 0,
      message: '成功',
    }
  }catch (e) {
    ctx.body = {
      code: -2,
      message: e,
    }
  }

};

/**
 * 重置密码
 * @param ctx
 * @returns {Promise<void>}
 */
exports.ResetPassword = async ctx => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.username;
  let ConfirmPassword = ctx.request.body.ConfirmPassword;
  let code = ctx.request.body.code;

  if(!username){
    ctx.body = {
      code: 0,
      status: -1,
      message: '用户名不可为为空',
    };
    return;
  }
  if(!password){
    ctx.body = {
      code: 0,
      status: -1,
      message: '密码不可为为空',
    };
    return;
  }
  if(password != ConfirmPassword){
    ctx.body = {
      code: 0,
      status: -1,
      message: '两次密码不一致',
    };
    return;
  }

  // 获取对象用户名验证码
  let CodeData = await RedisSync(`code_${username}`);

  if(!CodeData || CodeData != code){
    ctx.body = {
      code: 0,
      status: -1,
      message: '验证码不正确',
    };
    return;
  }

  try {
    await UserModel.update(
      {
        Password: Md5(password),
        UpdateAt: parseInt(new Date().getTime()/1000),
      },{
        where: {
          UserName:username
        }
      });
    // 删除已经校验完的用户
    client.del(`code_${username}`);
    ctx.body = {
      code: 0,
      status: 0,
      message: '重置密码成功',
    }
  }catch (e) {
    ctx.body = {
      code: -2,
      message: e,
    }
  }
};
