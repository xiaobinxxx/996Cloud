// 加载文件模块
const fs = require('fs');
// 加载路径模块
const path = require('path');
// 加载配置文件
const config = require('../config/index');
// 加载redis 连接模型
const client = require('../redis/index');

/**
 * redis 同步取值(字符串)
 * @param key
 * @returns {Promise<any>}
 * @constructor
 */
let RedisGetSync = async(key)=>{
  let doc = await new Promise( (resolve) => {
    client.get(key,function(err, res){
      return resolve(res);
    });
  });
  return doc;
};
/**
 * redis 同步存值(字符串)
 * @param key
 * @returns {Promise<any>}
 * @constructor
 */
let RedisSetSync = async(key,value)=>{
  let doc = await new Promise( (resolve) => {
    client.set(key,value,function(err, res){
      return resolve(res);
    });
    // 存储时长为7天
    client.expire(key, 603800);
  });
  return doc;
};
/**
 * 文件上传校验
 * @param ctx
 * @returns {Promise<void>}
 */
exports.uploadCheck = async ctx => {
  let requestBody = ctx.request.body;
  let plan = 0;
  let temp = await RedisGetSync(`temp_${requestBody.md5}`);
  temp = JSON.parse(temp);
  if(!temp){
    ctx.body = {
      code: 0,
      status: -200,
      result: {
        plan: 0,
        md5: '',
        num: '',
        total: '',
      },
      message: '不存在此文件',
    }
    return;
  }
  plan = (temp.num / temp.total) * 100;
  ctx.body = {
    code: 0,
    status: -100,
    result:{
      plan: plan,
      md5: temp.md5,
      num: temp.num,
      total: temp.total,
    },
    message: '继续上传',
  }
}
/**
 * 文件上传
 * @param ctx
 * @returns {Promise<void>}
 */
exports.upload = async ctx => {
  let requestBody = ctx.request.body;
  let file = ctx.request.files.file;
  let plan = 0;
  let url = ctx.request.body.url;
  let fileUrl = '.' + config.service.dir;
  let filePath = '';

  if(!file){
    ctx.body = {
      code: -1,
      message: '上传错误',
    };
    return;
  }

  // 判断url是否存在
  if(url){
    fileUrl = `.${config.service.dir}${url}`
  }

  // 1. 接受传入文件
  let temp = await RedisGetSync(`temp_${requestBody.md5}`);
  temp = JSON.parse(temp);
  if (temp) {
    temp.hash[requestBody.index] = file.path;
    temp.md5 = requestBody.md5;
    temp.num = temp.num + 1;
    await RedisSetSync(`temp_${requestBody.md5}`, JSON.stringify(temp));
  } else {
    let obj = {
      name: requestBody.name,
      total: requestBody.total,
      num: 1,
      hash: [file.path],
      md5: requestBody.md5,
    };
    await RedisSetSync(`temp_${requestBody.md5}`, JSON.stringify(obj));
    temp = await RedisGetSync(`temp_${requestBody.md5}`);
    temp = JSON.parse(temp);
  }
  // 上传进度
  if(temp){
    plan = (temp.num / temp.total) * 100;
  }
  // 2. 文件传输完成，开始合并文件
  if (plan===100) {
    filePath = path.join(__dirname, fileUrl) + `/${temp.name}`;
    // 创建存储文件
    fs.writeFileSync(filePath, '');
    for (let i = 0; i < temp.total; i++) {
      // 追加写入到文件中
      fs.appendFileSync(filePath, fs.readFileSync(temp.hash[i]));
      // 删除本次使用的chunk
      fs.unlinkSync(temp.hash[i]);
    }

    // 删除上传的文件缓存
    client.del(`temp_${requestBody.md5}`);
    console.log('文件传输完毕');
    ctx.body = {
      code: 0,
      result:{
        plan: 100,
      },
      message: '上传成功',
    }
    return;
  }

  ctx.body = {
    code: 0,
    status: -100,
    result:{
      plan: plan,
      md5: temp.md5,
      num: temp.num,
      total: temp.total,
    },
    message: '继续上传',
  }
};
/**
 * 文件上传(App)
 * @param ctx
 * @returns {Promise<void>}
 */
exports.uploadApp = async ctx => {
  let files = [];
  let url = ctx.request.body.url;
  let fileUrl = '.' + config.service.dir;
  let filePath;
  let reader;
  let upStream;
  if(!files){
    ctx.body = {
      code: -1,
      message: '上传错误',
    };
    return;
  }
  // 判断url是否存在
  if(url){
    fileUrl = `.${config.service.dir}${url}`
  }
  // 判断是否数组
  if(Array.isArray(ctx.request.files.file)){
    files = ctx.request.files.file;
  }else {
    files.push(ctx.request.files.file);
  }

  for (let file of files) {
    // 创建可读流
    reader = fs.createReadStream(file.path);
    // 获取上传文件扩展名
    filePath = path.join(__dirname, fileUrl) + `/${file.name}`;
    // 创建可写流
    upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
  }


  ctx.body = {
    code: 0,
    message: '上传成功',
  }
}
