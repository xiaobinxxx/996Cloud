const router = require('koa-router')();

router.get('/index/home', async ctx => {
  // console.log(ctx.request);
  // console.log(ctx.request.query.id);
  ctx.body = {code: 1};
});


module.exports = router;
