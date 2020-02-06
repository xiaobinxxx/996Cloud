import axios from 'axios'
import $router from '../router/index'
import { Message,Loading } from 'element-ui';
import Global from '../tool/Global'

const service = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 0,
});
/**
 * 请求前
 */
service.interceptors.request.use(config => {
  // loadingInstance = Loading.service();
  return config
}, error => {
  return Promise.reject(error)
});

/**
 * 请求后
 */
service.interceptors.response.use((resp) => {
  // loadingInstance.close();
  // 判断是否存在token
  if (resp.headers.token) {
    localStorage.setItem('token', resp.headers.token);
  }
  // 判断code
  if(resp.data.code === 0){
    return Promise.resolve(resp.data);
  }
  // token 失效，或登录失败
  if (resp.data.code === -200) {
    localStorage.removeItem('token');
    $router.push({name: 'login'});
    return Promise.reject(resp.data.message)
  }
  Message.error(resp.data.message);
  return Promise.reject(resp.data.message);

},  (err) => {
  console.log(err);
  return Promise.reject(err)
});

export default service
