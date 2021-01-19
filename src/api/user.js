import request from '@/utils/request';

// export function login(data) {
//   console.log(data)
//   return request({
//     url: '/user/login',
//     method: 'post',
//     params: data
//   })
// }

export function login(data) {
  console.log(data);
  return request({
    url: '/user/user/login/base',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  });
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  });
}
