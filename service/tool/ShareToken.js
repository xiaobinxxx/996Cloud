// 加载token模块
const jwt = require('jsonwebtoken');
// 加密数据
let payload = {};
// 私钥
let secret = '996_cloud_share';
// token
let PassToke = '';
//解密
let info = {};
// 加密函数
let getPayload = (mid) =>{
  payload = mid;
  // 设置token
  PassToke = jwt.sign(payload,secret,{
    expiresIn: 60*60*1  // 1小时过期
  });
  return PassToke
};

// 解密函数
let decode = (tokens) =>{
  jwt.verify(tokens, secret, (err, decode) => {
    info = decode;
  });
  return info
};

module.exports = {
  PassToke,
  info,
  getPayload,
  decode
};
