import request from '@/utils/request'

export function insertArticleLabel(data) {
  return request({
    url: '/article/label/insertArticleLabel',
    method: 'post',
    data
  })
}
