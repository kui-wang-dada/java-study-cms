import request from '@/utils/request';
export const uploadAction = process.env.VUE_APP_BASE_API + '/article/home/imgUpload';
export function upload() {
  return request({
    url: '/article/home/imgUpload',
    method: 'post'
  });
}
