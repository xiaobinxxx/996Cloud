const router = require('koa-router')();
// 引入文件
const file = require('../controller/file');

/*----------------------------文件操作接口-------------------------------*/
// 首页文件目录
router.post('/HomeFile', require('../controller/file').getHome);
// 首页文件目录
router.post('/getFiles', require('../controller/file').getFiles);
// 创建目录
router.post('/CreateFolder', require('../controller/file').CreateFolder);
// 删除文件及目录
router.post('/DeleteFile', require('../controller/file').DeleteFile);
// 文件重命名
router.post('/RenameFile', require('../controller/file').RenameFile);
// 压缩文件
router.post('/CompressedFiles', require('../controller/file').CompressedFiles);
// 解压文件
router.post('/unCompressedFiles', require('../controller/file').unCompressedFiles);
/*----------------------------登录、注册、用户信息操作----------------------------------*/
// 登录接口
router.post('/login', require('../controller/login').login);
// 注册接口
router.post('/register', require('../controller/login').register);
// 重置密码
router.post('/ResetPassword', require('../controller/login').ResetPassword);
/*----------------------------文件，图片上传----------------------------------*/
// 上传文件接口
router.post('/uploading', require('../controller/uploading').upload);
// 上传文件检查
router.post('/uploadCheck', require('../controller/uploading').uploadCheck);
// 上传文件app专用
router.post('/uploadApp', require('../controller/uploading').uploadApp);
/*----------------------------文件数据操作----------------------------------*/
// 收藏文件
router.post('/CollectFile', require('../controller/FileData').CollectFile);
// 收藏文件列表
router.post('/CollectFileList', require('../controller/FileData').CollectFileList);
// 生成分享
router.post('/GenerateShare', require('../controller/FileData').GenerateShare);
// 分享文件列表
router.post('/ShareFileList', require('../controller/FileData').ShareFileList);
// 分享文件详情
router.post('/ShareFileDetail', require('../controller/FileData').ShareFileDetail);
// 取消分享文件
router.post('/CancelShareFile', require('../controller/FileData').CancelShareFile);
// 密码校验
router.post('/ShareCheckPassword', require('../controller/FileData').ShareCheckPassword);
// 我的分享密码
router.post('/MyShareList', require('../controller/FileData').MyShareList);
/*----------------------------邮件操作----------------------------------*/
// 发送邮件
router.post('/SendEmails', require('../controller/email').SendEmails);
/*----------------------------app管理----------------------------------*/
router.post('/AppUpDate', require('../controller/AppAdmin').AppUpDate);
module.exports = router;
