import request from '@/utils/request';

export function fetchList(query) {
  return request({
    url: '/article/article/label/selectArticleLabel',
    method: 'get',
    params: query
  });
}

export function insertArticleLabel(data) {
  return request({
    url: '/article/article/label/insertArticleLabel',
    method: 'post',
    data
  });
}

export function deleteArticleLabel(query) {
  return request({
    url: '/article/article/label/deleteArticleLabel',
    method: 'get',
    params: query
  });
}
