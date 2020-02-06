// 加载token模块
const jwt  = require('jsonwebtoken');
// 加密数据
let payload = {};
// 私钥
let secret = '996_cloud_love';
// 会员id
let MemberId = '';
// token
let token = '';

// 加密函数
let getPayload = (mid) =>{
  payload = mid;
  // 设置token
  token = jwt.sign(payload,secret,{
    expiresIn: 60*60*1  // 1小时过期
  });
  return token
};
// 解密函数
let decode = (tokens) =>{
  jwt.verify(tokens, secret, (err, decode) => {
    MemberId = decode;
  });
  return MemberId
};

module.exports = {
  token,
  MemberId,
  getPayload,
  decode,
};
