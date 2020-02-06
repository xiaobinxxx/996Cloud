import axios from '../axios'
import store from '../store/index'
import SparkMD5 from  'spark-md5'
import { Message } from 'element-ui';
/**
 * get请求封装
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
function get(url, params) {
  return axios({
    header: {
      'Access-Control-Allow-Origin': '*',
    },
    headers: {
      'token': localStorage.getItem('token')||'',
    },
    url: url,
    method: 'GET',
    params: params,
  })
}

/**
 * post请求封装
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
function post(url, params) {
  return axios({
    header: {
      'Access-Control-Allow-Origin': '*',
    },
    headers: {
      'token': localStorage.getItem('token')||'',
    },
    url: url,
    method: 'POST',
    data: params
  })
}
/**
 * 文件上传封装
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
async function Postload(url, params) {

  let file = params.files[0];
  let data = {};
  let nameArr = [];
  let sizeArr = [];
  let name = file.name;        //文件名
  let size = file.size;        //总大小
  let i = 0;                  //当前上传数
  let shardSize = 2 *1024*1024;    //以2MB为一个分片
  let shardCount = Math.ceil(size / shardSize);  //总片数
  // 使用Blob.slice方法来对文件进行分割。
  // 同时该方法在不同的浏览器使用方式不同。
  let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

  /***
   * 生成md5文件校验
   * @param file
   * @returns {Promise<unknown>}
   */
  function Md5File(file) {
    return new Promise((resolve, reject) => {
      const chunks = Math.ceil(file.size / shardSize);
      let currentChunk = 0;
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();

      function loadNext() {
        const start = currentChunk * shardSize;
        const end = start + shardSize >= file.size ? file.size : start + shardSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      fileReader.onload = e => {
        spark.append(e.target.result); // Append array buffer
        currentChunk += 1;
        if (currentChunk < chunks) {
          loadNext();
        } else {
          console.log('finished loading');
          const result = spark.end();
          // 如果单纯的使用result 作为hash值的时候, 如果文件内容相同，而名称不同的时候
          // 想保留两个文件无法保留。所以把文件名称加上。
          const sparkMd5 = new SparkMD5();
          sparkMd5.append(result);
          sparkMd5.append(file.name);
          const hexHash = sparkMd5.end();
          resolve(hexHash);
        }
      };
      fileReader.onerror = () => {
        console.warn('文件读取失败！');
      };
      loadNext();
    }).catch(err => {
      console.log(err);
    });
  }
  let md5 = await Md5File(file);
  // 检是否存在已上传文件
  let temp = await uploadCheck({md5,});
  // 判断是否存在文件（存在继续上传）
  if(temp.status === -100){
    store.state.progress.complete = parseInt(temp.result.plan);
    i = parseInt(temp.result.num);
    shardCount = temp.result.total;
  }
  /*生成上传分片文件顺充，通过async.eachLimit()进行同步上传
   attr里面是[0,1,2,3...,最后一位]
  */
  for(i;i < shardCount;++i){
    let start = i * shardSize;//当前分片开始下标
    let end = Math.min(size, start + shardSize);//结束下标
    let form = new FormData();
    form.append("file", file.slice(start,end));  //slice方法用于切出文件的一部分
    form.append("name", name);//文件名字
    form.append("total", shardCount);  //总片数
    form.append("index", i);   //当前片数
    form.append("url", params.url);   //当前片数
    form.append('md5', md5);
    await axios({
      header: {
        'Access-Control-Allow-Origin': '*',
      },
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': '*/*',
        'token': localStorage.getItem('token')||'',
      },
      url: url,
      method: 'POST',
      data: form,
    }).then(res =>{
      store.state.progress.complete = parseInt(res.result.plan);
    }).catch(err =>{
      console.warn('网络上传失败请重新尝试！');
      Message.error('网络上传失败请重新尝试！');
    })
  }
  // for (let i = 0; i < params.files.length;i++) {
  //   nameArr.push(params.files[i].name);
  //   sizeArr.push(params.files[i].size);
  //   param.append('file', params.files[i]);
  //   param.append('url', params.url);
  // }
}

// 首页文件接口
export const HomeFile = params => {
  return post('/HomeFile', params)
};
// 进入目录接口
export const getFiles = params => {
  return post('/getFiles', params)
};
// 创建目录
export const CreateFolder = params => {
  return post('/CreateFolder', params)
};
// 登录
export const Login = params => {
  return post('/login', params)
};
// 注册
export const register = params => {
  return post('/register', params)
};
// 文件上传
export const Uploading = params => {
  return Postload('/uploading', params)
};
// 文件上传检查
export const uploadCheck = params => {
  return post('/uploadCheck', params)
};
// 删除文件
export const DeleteFile = params => {
  return post('/DeleteFile', params)
};
// 文件重命名
export const RenameFile = params => {
  return post('/RenameFile', params)
};
// 压缩文件
export const CompressedFiles = params => {
  return post('/CompressedFiles', params)
};
// 收藏文件
export const CollectFile = params => {
  return post('/CollectFile', params)
};
// 收藏文件列表
export const CollectFileList = params => {
  return post('/CollectFileList', params)
};
// 生成收藏
export const GenerateShare = params => {
  return post('/GenerateShare', params)
};
// 分享文件列表
export const ShareFileList = params => {
  return post('/ShareFileList', params)
};
// 分享文件详情
export const ShareFileDetail = params => {
  return post('/ShareFileDetail', params)
};
// 取消分享文件
export const CancelShareFile = params => {
  return post('/CancelShareFile', params)
};
// 分享文件密码校验
export const ShareCheckPassword = params => {
  return post('/ShareCheckPassword', params)
};
// 我的分享文件列表
export const MyShareList = params => {
  return post('/MyShareList', params)
};
// 发送邮件
export const SendEmails = params => {
  return post('/SendEmails', params)
};
// 重置密码
export const ResetPassword = params => {
  return post('/ResetPassword', params)
};
// 解压文件
export const unCompressedFiles = params => {
  return post('/unCompressedFiles', params)
};
// 下载文件
export const downloadFile = params => {
  return post('/downloadFile', params)
};
