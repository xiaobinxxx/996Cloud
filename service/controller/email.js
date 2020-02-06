
// 加载邮件模块
const email = require('../tool/email');
// 加载redis 连接模型
const client = require('../redis/index');
// 加载用户表
const UserModel = require('../schemas/users');

/**
 * 随机生成6位数字
 * @returns {string}
 */
function randomNum(){
  return ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
}
/**
 * 发送邮件
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.SendEmails = async ctx => {
  let username = ctx.request.body.username;

  let UserInfo = await UserModel.findOne({
    where:{
      UserName: username,
    }
  });
  if(!UserInfo){
    ctx.body = {
      code: -1,
      message: '账户不存在哦',
    };
    return;
  }
  let code = randomNum();
  // 设置 key 用户名 value 验证码
  client.set(`code_${username}`, code);
  // 获取用户名key
  client.get(`code_${username}`);
  // 设置时间 5分钟过期时间
  client.expire(`code_${username}`, 300);
  // 发送邮件
  email.sendMail(UserInfo.email,`996私有云重置密码邮件`,`验证码：${code}<a href="http://localhost:3303/ResetPassword">点击此处重置密码</a>`);
  ctx.body = {
    code: 0,
    message: '邮件已发送成功',
  }
};
