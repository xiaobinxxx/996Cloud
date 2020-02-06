

/**
 * app 更新检查
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.AppUpDate = async ctx => {
  let versions = '1.0.0';
  if(versions != ctx.header.versions){
    ctx.body = {
      code: -1024,
      url: encodeURIComponent('http://cloud.996ico.cn/#/SharePage?ShareUrl=LEM51580887229338&privacy=2'),
      message: '有新的版本，请更新新版本',
    }
    return;
  }
  ctx.body = {
    code: 0,
    message: '暂无新的版本',
  }

}
