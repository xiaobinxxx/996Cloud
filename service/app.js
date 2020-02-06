const Koa = require('koa');
const Router = require('koa-router');
// 加载文件模块
const fs = require('fs');
// 加载路径模块
const path = require('path');
// 加载跨域模块
const cors = require('koa-cors');
// 加载静态文件模块
const static = require('koa-static');
// 加载数据模型
const sequelize = require('./mysql/sequelize');
// 加载mysql
const Mysql = require('./mysql/mysql');
// 加载token验证中间件
const check = require('./tool/check');
// 加载koaBody文件上传中间件
const koaBody = require('koa-body');
// 加载配置文件
const config = require('./config/index');
const app = new Koa();

const router = new Router();

app.use(async (ctx, next)=> {
  // 域名白名单
  let allow_origin = [
    "http://localhost:8080",
    "http://localhost:3303",
    "http://localhost:8081",
  ];
  // 允许的域名
  let origin = ctx.headers.origin;
  // 跨域判断是否在白名单内
  if (!allow_origin.includes(ctx.headers.origin)) {
    origin = 'http://localhost:8080'
  }
  ctx.set('Access-Control-Allow-Origin', origin);
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , token, url,versions');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  ctx.set('Access-Control-Expose-Headers', 'token');
  // ctx.set('Content-Type', 'application/json;charset=UTF-8');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});

// 配置静态存放文件
app.use(static(path.resolve(__dirname, config.service.dir)));
// 渲染前端页面
app.use(static(path.resolve(__dirname, '../dist')));
// 应用级中间件
app.use(async (ctx, next) => {
  await next();
});

// 检查页面
app.use(async (ctx, next)=> {
  await next();
  if(ctx.status === 404){
    ctx.status = 404;
    ctx.body="404页面"
  }
});
// 验证token
app.use(check);

// 文件上传
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 2000 * 1024 * 1024  // 设置上传文件大小最大限制，默认2M
  }
}));

// 启动路由
app.use(router.routes()).use(router.allowedMethods());
// 路由表
app.use(require('./router/ApiRouter').routes());

// 测试连接是否成功
sequelize
  .authenticate()
  .then(() => {
    console.log('数据库连接成功');
    console.log('http://127.0.0.1:3002');
    app.listen(3002);
  })
  .catch(err => {
    console.log('数据库连接失败', err)
  });
