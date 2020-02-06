const Promise = require("bluebird");
const jwt = require("jsonwebtoken");
const verify = Promise.promisify(jwt.verify);
// 私钥
let secret = '996_cloud_share';
async function ShareCheck(token) {
  if(!token){
    return false
  }
  try {
    // 解码
    await verify(token, secret);
    return true;
  } catch (e) {
    return false;
  }
}
module.exports = ShareCheck;
