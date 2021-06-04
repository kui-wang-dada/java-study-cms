import request from '@/utils/request';
export const uploadAction = process.env.VUE_APP_BASE_API + '/article/article/home/imgUpload';
request.headers = {
  'Content-Type': 'multipart/form-data'
};
export function upload(formdata) {
  return request({
    url: '/article/article/home/imgUpload',
    method: 'post',
    data: formdata,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
