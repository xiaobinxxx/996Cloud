// 加载文件模块
const fs = require('fs');
// 加载路径模块
const path = require('path');
// 加载工具
const util = require('../tool/util');
// 加载token文件
const token = require('../tool/token');
// 加载token文件
const ShareToken = require('../tool/ShareToken.js');
// 加载收藏表
const CollectModel = require('../schemas/filecollects');
// 加载分享表
const ShareModel = require('../schemas/file_shares');
// 加载分享密码验证中间件
const ShareCheck = require('../tool/ShareCheck');
// 加载配置文件
const config = require('../config/index');
/**
 * 大小排序
 * @param a
 * @param b
 * @returns {number}
 */
function sortData(a, b) {
  return b.type - a.type
}
/**
 * 失效分享更新
 * @param ShareId
 * @returns {Promise<void>}
 * @constructor
 */
async function ShareUpdate(ShareId) {
  await ShareModel.update(
    {
      EndTime: 0,
      ino: 0,
      isExpiry: 1,
    },
    {
      where: {
        ShareId: ShareId,
      },
    });
}

/**
 * 收藏文件
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.CollectFile = async ctx => {
  let ino = ctx.request.body.ino || '';
  let url = ctx.request.body.url || '';
  let fileName = ctx.request.body.fileName || '';
  let type = ctx.request.body.type || 0;
  // 收藏状态 1 收藏 2 取消收藏
  let status = ctx.request.body.status || 0;
  let tokenUser = ctx.request.headers.token;
  let MemberId = token.decode(tokenUser).MemberId;
  // 收藏
  let CollectInfo = {};
  if(url.indexOf('../') != -1){
    ctx.body = {
      code: -10,
      message: '不存在此目录',
    };
    return;
  }
  if (!ino) {
    ctx.body = {
      code: -1,
      message: '标识id不可为空',
    };
    return;
  }

  if (!fileName) {
    ctx.body = {
      code: -1,
      message: '文件名不可为空',
    };
    return;
  }

  if (type === undefined) {
    ctx.body = {
      code: -1,
      message: '文件类型不可为空',
    };
    return;
  }
  if (!status) {
    ctx.body = {
      code: -1,
      message: '收藏状态不可为空',
    };
    return;
  }

  try {
    if (status === 1) {
      // 查询是收藏记录
      CollectInfo = await CollectModel.findOne({where: {ino: ino}});
      // 是否收藏过
      if (CollectInfo) {
        ctx.body = {
          code: -2,
          message: '已收藏',
        };
        return
      }
      // 添加收藏记录
      await CollectModel.create({
        ino: ino.toString(),
        url: url,
        fileName: fileName,
        CollectDate: parseInt(new Date().getTime() / 1000),
        MemberId: MemberId,
        type: type,
      });
    } else {
      // 取消收藏     删除收藏记录
      await CollectModel.destroy({where: {ino: ino.toString()}});
    }
    // 发送数据
    ctx.body = {
      code: 0,
      message: status === 1 ? '收藏成功' : '取消成功',
    };
  } catch (e) {
    ctx.body = {
      code: -2,
      message: e,
    };
  }
};
/**
 * 收藏文件列表
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.CollectFileList = async ctx => {
  let tokenUser = ctx.request.headers.token;
  let MemberId = token.decode(tokenUser).MemberId;
  let CollectList = {};
  let FileInfo = {};
  // 查询收藏全部记录
  CollectList = await CollectModel.findAll({
    where: {
      MemberId,
    }
  });
  // 发送数据
  ctx.body = {
    code: 0,
    result: CollectList.map((item) => {
      FileInfo = fs.statSync(`${config.service.dir}${item.url}`);
      return {
        CollectId: item.CollectId,
        ino: item.ino,
        url: item.url,
        name: item.fileName,
        CollectDate: item.CollectDate,
        isCollect: 1,
        type: item.type,
        size: util.renderSize(FileInfo.size),
        SizeNum: FileInfo.size,
        ctime: util.getDateDiff(FileInfo.ctime),
        ctimeNum: new Date(FileInfo.ctime / 1000).getTime(),
        isName: false,
      }
    }),
    message: '成功'
  }
};
/**
 * 分享生成
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.GenerateShare = async ctx => {
  // 接值
  let ino = ctx.request.body.ino || '';
  let url = ctx.request.body.url || '';
  let name = ctx.request.body.name || '';
  let type = ctx.request.body.type || '';
  let EndTime = ctx.request.body.EndTime || '';
  let isPrivacy = ctx.request.body.isPrivacy || '';
  let password = ctx.request.body.password || '';
  let tokenUser = ctx.request.headers.token;
  // 定义
  let MemberInfo = token.decode(tokenUser);
  let ShareUrl = util.RandomStr();

  if(url.indexOf('../') != -1){
    ctx.body = {
      code: -10,
      message: '不存在此目录',
    };
    return;
  }
  if (!ino) {
    ctx.body = {
      code: -1,
      message: '标识id不可为空',
    };
    return;
  }

  if (!name) {
    ctx.body = {
      code: -1,
      message: '文件名不可为空',
    };
    return;
  }
  if (type === undefined) {
    ctx.body = {
      code: -1,
      message: '文件类型不可为空',
    };
    return;
  }
  if (!EndTime) {
    ctx.body = {
      code: -1,
      message: '失效时间不可为空',
    };
    return;
  }
  if (!isPrivacy) {
    ctx.body = {
      code: -1,
      message: '请选择是链接类型',
    };
    return;
  }

  await ShareModel.create({
    StartTime: parseInt(new Date().getTime() / 1000),
    EndTime: EndTime,
    ShareUrl: ShareUrl,
    ShareOne: MemberInfo.UserName,
    MemberId: MemberInfo.MemberId,
    ino: ino.toString(),
    url: url,
    name: name,
    type: type||0,
    isPrivacy: isPrivacy,
    password: password,
  });

  let ShareInfo = await ShareModel.findOne({
    where: {
      ino: ino.toString()
    }
  });
  ctx.body = {
    code: 0,
    result: {
      ShareUrl: ShareInfo.ShareUrl,
      ShareId: ShareInfo.ShareId,
      password: ShareInfo.password,
    },
    message: '成功',
  }
};
/**
 * 分享文件列表
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.ShareFileList = async ctx => {
  let ShareUrl = ctx.request.body.ShareUrl || '';
  let PassToke = ctx.request.body.PassToke || '';
  let privacy = ctx.request.body.privacy || '';
  let status = ctx.request.body.status || '';     // 分享状态 1 查看分享 其他查看自己分享
  let CurrentTime = parseInt(new Date().getTime() / 1000);
  let FileInfo = {};
  // 目录
  let HomeFiles = [];
  let FileList = [];
  let ino = ctx.request.body.ino || '';
  let url = ctx.request.body.url || '';
  let filePath = config.service.dir + url;
  let fileName = url;
  let reg = /[\s\.]/g;
  if(reg.test(url)){
    ctx.body = {
      code: -10,
      message: '不存在此目录',
    };
    return;
  }
  if(status != 1){
    // 获取token 获取自己分享列表
    let tokenUser = ctx.request.headers.token||'';
    let MemberId = token.decode(tokenUser).MemberId;
  }


  if (!ShareUrl) {
    ctx.body = {
      code: -1,
      message: '方式错误'
    };
    return;
  }
  if (!privacy) {
    ctx.body = {
      code: -1,
      message: '文件访问类型错误'
    };
    return;
  }
  // 解析密码token
  let checkToken = await ShareCheck(PassToke);
  if (privacy == 1) {
    if (!PassToke) {
      return;
    }
    // 判断密码token 是否有效
    if (!checkToken) {
      ctx.body = {
        code: 0,
        status: -100,
        message: '验证失败'
      };
      return
    }
  }

  let ShareList = await ShareModel.findAll({
    where: {
      ShareUrl: ShareUrl,
    }
  });

  let list = [];
  for (let i = 0; i < ShareList.length; i++) {
    FileInfo = fs.statSync(`${config.service.dir}${ShareList[i].url}`);
    list.push({
      ShareOne: ShareList[i].ShareOne,
      ino: ShareList[i].ino,
      url: ShareList[i].url,
      name: ShareList[i].name,
      type: ShareList[i].type,
      size: util.renderSize(ShareList[i].size),
      SizeNum: ShareList[i].size,
      ctime: util.getDateDiff(ShareList[i].ctime),
      isPrivacy: ShareList[i].isPrivacy,
    });

    // 判断是否是私密文件并且查看密码token 是否有效
    if (ShareList[i].isPrivacy === 1 && !checkToken) {
      list = [];
    }
    // 判断是否是私密文件并且查看privacy 是否是私密文件值
    if(ShareList[i].isPrivacy == 1 && privacy == 2){
      list = [];
    }
    // 判断文件失效已过期
    if (CurrentTime >= ShareList[i].EndTime) {
      // 失效更新
      ShareUpdate(ShareList[i].ShareId);
      list = [];
    }
  }
  if(!url||!ino){
    ctx.body = {
      code: 0,
      result: list,
      message: '成功'
    };
    return;
  }
  if(list.length === 0){
    // 发送数据
    ctx.body = {
      code: 0,
      result: [],
      message: '成功',
    };
    return;
  }
  // 读取文件-------进入目录
  FileList = await fs.readdirSync(filePath);
  for( let i = 0; i < FileList.length;i++) {
    //获取当前文件的绝对路径
    let filedir = path.join(filePath, FileList[i]);
    // 读取文件信息
    let stats = fs.statSync(filedir);
    let isFile = stats.isFile();      //是文件
    let isDir = stats.isDirectory();  //是文件夹
    // 存入数据
    HomeFiles.push({
      ino: stats.ino,                                       // 唯一标识
      name: FileList[i],                                    // 文件名
      type: isFile ? 0 : 1,                                 // 文件类型 0 文件 1 文件夹
      size: util.renderSize(stats.size),                    // 文件大小(字符串)
      ctime: util.getDateDiff(stats.ctime),                 // 文件创建时间
      url: `${fileName}/${FileList[i]}`,                    // 文件路径
      isName: false,                                        // 名字状态
      isCheck: false,                                       // 选择状态
      SizeNum: stats.size,                                  // 文件大小整型
    });
  }

  HomeFiles.sort(sortData);

  ctx.body = {
    code: 0,
    result: HomeFiles,
    message: '成功'
  };
};

/**
 * 查看分享文件详情
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.ShareFileDetail = async ctx => {
  let ino = ctx.request.body.ino || '';
  let CurrentTime = parseInt(new Date().getTime() / 1000);
  if (!ino) {
    ctx.body = {
      code: -1,
      message: '标识id不可为空'
    };
    return;
  }

  try {
    // 查询
    let ShareInfo = await ShareModel.findOne({
      where: {
        ino: ino,
      }
    });

    if (!ShareInfo || CurrentTime >= ShareInfo.EndTime) {
      // 失效更新
      ShareInfo ? ShareUpdate(ShareInfo.ShareId) : '';
      ctx.body = {
        code: 0,
        result: {},
        message: '成功'
      };
      return;
    }
    ctx.body = {
      code: 0,
      result: ShareInfo ? {
        ShareOne: ShareInfo.ShareOne,
        ino: ShareInfo.ino,
        url: ShareInfo.url,
        name: ShareInfo.name,
        type: ShareInfo.type,
        ShareUrl: ShareInfo.ShareUrl,
        EndTime: ShareInfo.EndTime,
        ShareId: ShareInfo.ShareId,
        password: ShareInfo.password,
        isPrivacy: ShareInfo.isPrivacy,
      } : {},
      message: '成功'
    }
  } catch (e) {
    ctx.body = {
      code: -2,
      message: e,
    }
  }

};
/**
 * 取消分享
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.CancelShareFile = async ctx => {
  let ShareId = ctx.request.body.ShareId || '';
  let CurrentTime = parseInt(new Date().getTime() / 1000);

  if (!ShareId) {
    ctx.body = {
      code: -1,
      message: 'ShareId不可为空'
    };
    return;
  }
  try {
    // 失效更新
    ShareUpdate(ShareId);
    ctx.body = {
      code: 0,
      message: '取消成功',
    }
  } catch (e) {
    ctx.body = {
      code: -2,
      message: e,
    }
  }
};
/**
 * 分享密码校验
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.ShareCheckPassword = async ctx => {
  let ShareUrl = ctx.request.body.ShareUrl || '';
  let password = ctx.request.body.password || '';
  let PassToke = ctx.request.body.PassToke || '';

  if (!ShareUrl) {
    ctx.body = {
      code: -1,
      message: '分享地址不可为空'
    };
    return;
  }
  // if (!password) {
  //   ctx.body = {
  //     code: -1,
  //     message: '密码不可为空'
  //   };
  //   return;
  // }
  let ShareInfo = await ShareModel.findOne({
    where: {
      ShareUrl: ShareUrl,
      password: password,
    }
  });

  if (!ShareInfo) {
    ctx.body = {
      code: 0,
      status: -2,
      message: '密码错误'
    };
    return;
  }

  // 加密
  PassToke = ShareToken.getPayload({
    ShareId: ShareInfo.ShareId,
    ShareOne: ShareInfo.ShareOne,
    ShareUrl: ShareInfo.ShareUrl
  });
  ctx.body = {
    code: 0,
    status: 0,
    result: {
      PassToke: PassToke,
    },
    message: '成功'
  };
};
/**
 * 我的分享列表
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.MyShareList = async ctx => {
  // 获取token 获取自己分享列表
  let tokenUser = ctx.request.headers.token||'';
  let MemberId = token.decode(tokenUser).MemberId;
  let CurrentTime = parseInt(new Date().getTime() / 1000);
  let FileInfo = {};
  let result = [];

  let ShareList = await ShareModel.findAll({
    where: {
      MemberId: MemberId,
    }
  });
  // 筛选字段
  ShareList.map((item)=>{
    if(item.EndTime != 0){
      if(CurrentTime >= item.EndTime){
        // 失效更新
        ShareUpdate(item.ShareId);
      }
    }
    try {
      FileInfo = fs.statSync(`${config.service.dir}${item.url}`);
    }catch (e) {
      console.log(e);
    }

    if(item.isExpiry === 2){
      result.push({
        ShareId: item.ShareId,
        StartTime: item.StartTime,
        EndTime: item.EndTime,
        ShareUrl: item.ShareUrl,
        type: item.type,
        ino: item.ino,
        url: item.url,
        name: item.name,
        size: util.renderSize(FileInfo.size),
        SizeNum: FileInfo.size,
        ctime: util.getDateDiff(FileInfo.ctime),
        ctimeNum: new Date(FileInfo.ctime / 1000).getTime(),
        isName: false,
      })
    }
  });

  ctx.body = {
    code: 0,
    result: result,
    message: '成功',
  }
};
