const Promise = require("bluebird");
const jwt = require("jsonwebtoken");
const verify = Promise.promisify(jwt.verify);
// 加载redis 连接模型
const client = require('../redis/index');
// 私钥
let secret = '996_cloud_love';
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
  return doc;
};
async function check(ctx, next) {
  let url = ctx.request.url;
  let payload;
  // 不检查token接口
  let UrlList = [
    '/login',
    '/ShareFileList',
    '/ShareCheckPassword',
    '/GetShareFileList',
    '/register',
    '/SendEmails',
    '/ResetPassword',
    '/AppUpDate',
    '/FileUrl'
  ];
  // 登录 不用检查
  if (UrlList.findIndex((value)=>value == url) != -1) {
    await next();
  } else {
    // 规定token写在header 的 'autohrization'
    let token = ctx.request.headers["token"];
    try {
      // 解码
      payload = await verify(token,secret);
      let time = payload.iat;
      let timeout = payload.exp;
      let data = parseInt(new Date().getTime()/1000);
      let login_token = await RedisSync(`login_${payload.UserName}`);
      let isToken = login_token === token;
      // 判断token 是否存在redis
      if(!isToken){
        //过期
        ctx.body = {
          code: -200,
          message: 'token 已过期'
        };
        return
      }
      // 判断是否存在过期
      if ((data - time) <= timeout) {
        // 未过期
        await next();
      } else {
        //过期
        ctx.body = {
          code: -200,
          message: 'token 已过期'
        };
      }
    }catch (e) {
      if(e.errno === -4058){
        ctx.body = {
          code: -2,
          message: '文件不存在或已移动',
        };
        return;
      }
      //解析失败
      ctx.body = {
        code: -200,
        message: e,
      };
    }
  }
}

module.exports = check;
