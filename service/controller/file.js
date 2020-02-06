// 加载文件模块
const fs = require('fs');
// 加载路径模块
const path = require('path');
// 加载工具
const util = require('../tool/util');
// 加载压缩模块
const compressing = require('compressing');
// const archiver = require('archiver');
// 加载token文件
const token = require('../tool/token');
// 加载收藏表
const CollectModel = require('../schemas/filecollects');
// 加载分享表
const ShareModel = require('../schemas/file_shares');
// 加载配置文件
const config = require('../config/index');
/**
 * 大小排序
 * @param {Int} a   类型1
 * @param {Int} b   类型2
 * @returns {number}
 */
function sortData(a, b) {
  return b.type - a.type
}
/**
 * 重新命名连锁数据更新
 */
async function RenameUpdate(NewName,url,ino){
  let ShareInfo = await ShareModel.findOne({where: {ino: ino}});
  if(ShareInfo){
    ShareModel.update(
      {
        name: NewName,
        url: url,
      },{
        where:{
          ino: ino,
        }
      }).then(res =>{});
  }
  let CollectInfo = await CollectModel.findOne({where:{ino:ino}});
  if(CollectInfo){
    CollectModel.update(
      {
        name: NewName,
        url: url,
      },{
        where:{
          ino: ino,
        }
      }).then(res =>{});
  }
}
/**
 * 删除文件连锁数据更新
 */
async function DelUpdate(ino){
  let ShareInfo = await ShareModel.findOne({where: {ino: ino}});
  if(ShareInfo){
    ShareModel.destroy({
        where:{
          ino: ino,
        }
      }).then(res =>{});
  }
  let CollectInfo = await CollectModel.findOne({where:{ino:ino}});
  if(CollectInfo){
    CollectModel.destroy({
        where:{
          ino: ino,
        }
      }).then(res =>{});
  }
}
/**
 * 获取主目录
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getHome = async ctx => {
  let HomeFiles = [];
  let FileList = [];
  let filePath = config.service.dir;
  let fileName = '';
  let CollectInfo = {};

  try {
    FileList = fs.readdirSync(filePath);
    for( let i = 0; i < FileList.length;i++) {
      //获取当前文件的绝对路径
      let filedir = path.join(filePath, FileList[i]);
      // 读取文件信息
      let stats = fs.statSync(filedir);
      let isFile = stats.isFile();      //是文件
      let isDir = stats.isDirectory();  //是文件夹
      // 查询是否有收藏文件
      CollectInfo = await CollectModel.findOne({
        where: {
          ino: stats.ino
        }
      });
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
        ctimeNum: new Date(stats.ctime / 1000).getTime(),// 文件创建时间证型
        isCollect: CollectInfo ? 1 : 2,                       // 文件收藏状态 1 收藏 2 取消收藏
      });
    }

    HomeFiles.sort(sortData);
    // 发送数据
    ctx.body = {
      code: 0,
      result: HomeFiles,
      message: '成功',
    }
  } catch (e) {
    ctx.body = e;
  }
};
/**
 * 进入目录接口
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getFiles = async ctx => {
  let HomeFiles = [];
  let FileList = [];
  let ino = ctx.request.body.ino || '';
  let url = ctx.request.body.url || '';
  let filePath = config.service.dir + url;
  let fileName = url;
  let CollectInfo = {};
  if (!ino) {
    ctx.body = {
      code: -1,
      message: 'ino不可为空',
    };
    return;
  }
  if (!url) {
    ctx.body = {
      code: -1,
      message: 'url不可为空',
    };
    return;
  }
  try {
    FileList = await fs.readdirSync(filePath);
    for( let i = 0; i < FileList.length;i++) {
      //获取当前文件的绝对路径
      let filedir = path.join(filePath, FileList[i]);
      // 读取文件信息
      let stats = fs.statSync(filedir);
      let isFile = stats.isFile();      //是文件
      let isDir = stats.isDirectory();  //是文件夹

      // 查询是否有收藏文件
      CollectInfo = await CollectModel.findOne({
        where: {
          ino: stats.ino
        }
      });
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
        ctimeNum: new Date(stats.ctime / 1000).getTime(),// 文件创建时间证型
        isCollect: CollectInfo ? 1 : 2,                       // 文件收藏状态 1 收藏 2 取消收藏
      });
    }

    HomeFiles.sort(sortData);

    // 发送数据
    ctx.body = {
      code: 0,
      result: HomeFiles,
      message: '成功',
    }
  } catch (e) {
    if(e.errno = -4058){
      ctx.body = {
        code: -2,
        message: '文件不存在或已删除'
      };
      return;
    }
    ctx.body = e;
  }
};
/**
 * 创建文件夹
 * @param ctx
 * @returns {Promise<void>}
 */
exports.CreateFolder = async ctx => {
  let ino = ctx.request.body.ino || '';
  let url = ctx.request.body.url || '';
  let fileName = ctx.request.body.fileName || '';
  let filePath = config.service.dir + url;

  if (!fileName) {
    ctx.body = {
      code: 0,
      status: -1,
      message: '文件名不可为空',
    };
    return;
  }
  if (!url) {
    filePath = config.service.dir;
  }
  try {
    let mkdir = await fs.mkdirSync(`${filePath}/${fileName}`);
    ctx.body = {
      code: 0,
      status: 0,
      message: '目录创建成功',
    };
  } catch (e) {
    ctx.body = {
      code: 0,
      status: -2,
      message: '目录已存在或不合法',
    };
  }

};

/**
 * 删除文件
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.DeleteFile = async ctx => {
  let FilesArr = ctx.request.body.FilesArr;
  let name = '';
  let url = '';
  let type = 0;
  let filePath = '';
  let isunlink = 0;
  if (FilesArr.length === 0) {
    ctx.body = {
      code: 0,
      status: -1,
      message: '请选择删除文件',
    };
    return;
  }

  for (let i = 0; i < FilesArr.length; i++) {
    await DelUpdate(FilesArr[i].ino);
    name = FilesArr[i].name || '';
    url = FilesArr[i].url || '';
    type = FilesArr[i].type;
    filePath = `${config.service.dir}${url}`;
    if (type === 0) {
      // 删除文件
      try {
        await fs.unlinkSync(filePath);
      } catch (e) {
        isunlink = -1
      }
    }
    if (type === 1) {
      await delDir(`${filePath}`)
    }
  }

  if (isunlink === -1) {
    ctx.body = {
      code: 0,
      status: -2,
      message: '参数错误',
    };
    return
  }
  async function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
      files = fs.readdirSync(path);
      files.forEach((file, index) => {
        let curPath = path + "/" + file;
        if(fs.statSync(curPath).isDirectory()){
          delDir(curPath); //递归删除文件夹
        } else {
          fs.unlinkSync(curPath); //删除文件
        }
      });
      try {
        fs.rmdirSync(path);
      }catch (e) {
        if(e.errno == -4051){
          for(let i = 0; i < 2; i++){
            delDir(path);
          }
        }
      }
    }
  }

  ctx.body = {
    code: 0,
    status: 0,
    message: '成功',
  };
};
/**
 * 文件重命名
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.RenameFile = async ctx => {
  let FileIno = ctx.request.body.FileIno || '';
  let FileUrl = ctx.request.body.FileUrl || '';
  let name = ctx.request.body.name || '';
  let NewName = ctx.request.body.NewName || '';
  let url = ctx.request.body.url || '';
  let filePath = `${config.service.dir}${url}`;

  if (!name) {
    ctx.body = {
      code: -1,
      message: '缺少名字',
    };
    return;
  }
  if (!NewName) {
    ctx.body = {
      code: -1,
      message: '缺少新名字',
    };
    return;
  }
  try {
    await RenameUpdate(NewName,`${url}/${NewName}`,FileIno);
    fs.renameSync(`${filePath}/${name}`, `${filePath}/${NewName}`,);
    ctx.body = {
      code: 0,
      message: '成功',
    };
  } catch (e) {
    if(e.errno === -4048){
      ctx.body = {
        code: -2,
        message: '目下存在文件请确保空目录在重新命名',
      };
      return;
    }
    ctx.body = {
      code: -2,
      message: '文件错误请检查',
    };
  }

};

/**
 * 压缩文件
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.CompressedFiles = async ctx => {
  let FilesArr = ctx.request.body.FilesArr;
  let rootPath = config.service.dir;
  let fileName = `${FilesArr[0].name}`;
  let sec = 0;
  let timer = null;
  // 判断是传值
  if(!FilesArr || FilesArr.length === 0){
    ctx.body = {
      code: -1,
      message: '请传参',
    };
    return;
  }

  try {
    timer = setInterval(()=>{
      sec++;
    },1000);
    await compressing.zip.compressDir(`${rootPath}${FilesArr[0].url}/${FilesArr[0].name}`, `${rootPath}${FilesArr[0].url}/${FilesArr[0].name}.zip`);
    console.log('success,用时'+ sec + '秒');
    clearInterval(timer);
    ctx.body = {
      code: 0,
      result: {
        name: fileName,
        url: `${FilesArr[0].url}/${FilesArr[0].name}.zip`
      },
      message: '成功',
    };
  }catch (e) {
    ctx.body = {
      code: -2,
      message: e,
    };
  }



  // // 创建文件输出流
  // let output = await fs.createWriteStream(`${rootPath}${FilesArr[0].url}/${fileName}.zip`);
  //
  // let archive = archiver('zip', {
  //   zlib: {level: 9} // 设置压缩级别
  // });
  //
  // // 文件输出流结束
  // output.on('close', function () {
  //   console.log(`总共 ${archive.pointer()} 字节`);
  //   console.log('archiver完成文件的归档，文件输出流描述符已关闭');
  //   su = true;
  // });
  //
  // // 数据源是否耗尽
  // output.on('end', function () {
  //   console.log('数据源已耗尽')
  // });
  //
  // // 存档警告
  // archive.on('warning', function (err) {
  //   if (err.code === 'ENOENT') {
  //     console.warn('stat故障和其他非阻塞错误')
  //   } else {
  //     throw err
  //   }
  // });
  //
  // // 存档出错
  // archive.on('error', function (err) {
  //   throw err
  // });
  //
  // // 通过管道方法将输出流存档到文件
  // archive.pipe(output);
  // console.log(222);
  // // 从流中追加文件
  // for(let i = 0; i < FilesArr.length;i++) {
  //   if (FilesArr[i].type === 0) {
  //     archive.append(fs.createReadStream(`${rootPath}${FilesArr[i].url}/${FilesArr[i].name}`), {name: `${FilesArr[i].name}`});
  //   }
  //   if (FilesArr[i].type === 1) {
  //     archive.directory(`${rootPath}${FilesArr[i].url}/${FilesArr[i].name}`, `${FilesArr[i].name}`);
  //   }
  // }
  // //完成归档
  // archive.finalize();
};

/**
 * 解压文件
 * @param ctx
 * @returns {Promise<void>}
 * @constructor
 */
exports.unCompressedFiles = async ctx => {
  let FilesArr = ctx.request.body.FilesArr;
  let rootPath = config.service.dir;
  let fileName = `${FilesArr[0].name}`;
  // 判断是传值
  if(!FilesArr || FilesArr.length === 0){
    ctx.body = {
      code: -1,
      message: '请传参',
    };
    return;
  }
  try {
    // 解压文件
    await compressing.zip.uncompress(`${rootPath}${FilesArr[0].url}/${FilesArr[0].name}`, `${rootPath}${FilesArr[0].url}/${FilesArr[0].name.split('.')[0]}`);
    ctx.body = {
      code: 0,
      message: '解压成功'
    }
  }catch (e) {
    ctx.body = {
      code: -2,
      message: e
    }
  }

};
