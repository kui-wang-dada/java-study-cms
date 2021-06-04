import axios from 'axios';
import Qs from 'qs';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
import { showFullScreenLoading, tryHideFullScreenLoading } from './loading';

console.log(process.env);
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    // 'Content-Type': 'application/json;charset=UTF-8'
  },
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    /* 特殊页面，需要对数据做处理 */
    if (config.method.toUpperCase() === 'POST' || config.method.toUpperCase() === 'PUT') {
      if (config.data) {
        config.data = Qs.stringify(config.data);
      }
    }

    // do something before request is sent
    showFullScreenLoading();
    config.headers['platform'] = 'app_web_manager';
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken();
    }
    return config;
  },
  error => {
    tryHideFullScreenLoading();
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    tryHideFullScreenLoading();
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 0) {
    //   Message({
    //     message: res.msg || '获取数据失败，请检查请求',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('您已注销，您可以取消停留在该页上，或重新登录，确认注销', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return res.msg || '获取数据失败，请检查请求'
    // } else {
    //   return res
    // }

    if (res.code !== 0) {
      Message({
        message: res.msg || '获取数据失败，请检查请求',
        type: 'error',
        duration: 5 * 1000
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('您已注销，您可以取消停留在该页上，或重新登录，确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload();
          });
        });
      }
      return res.msg || '获取数据失败，请检查请求';
    } else {
      return res;
    }
  },
  error => {
    console.log('err' + error); // for debug
    console.log('err' + error.response.status); // for debug
    tryHideFullScreenLoading();
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.msg = '请求错误';
          break;
        case 401:
          error.msg = '未授权，请登录';
          break;
        case 403:
          error.msg = '拒绝访问';
          break;
        case 404:
          error.msg = `请求地址出错:地址${error.response.config.url}`;
          break;
        case 405:
          error.msg = `不允许的请求方法`;
          break;
        case 408:
          error.msg = '请求超时';
          break;
        case 500:
          error.msg = '服务器内部错误';
          break;
        case 501:
          error.msg = '服务未实现';
          break;
        case 502:
          error.msg = '网关错误';
          break;
        case 503:
          error.msg = '服务不可用';
          break;
        case 504:
          error.msg = '网关超时';
          break;
        case 505:
          error.msg = 'HTTP版本不受支持';
          break;
        default:
          break;
      }
    }
    Message({
      message: `服务器响应失败,错误信息: ${error.msg}`,
      type: 'error'
    });
    return Promise.reject(error);
  }
);

export default service;
