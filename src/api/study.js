import request from '@/utils/request';

export function fetchList(query) {
  return request({
    url: '/article/article/download/selectArticleDownLoadList',
    method: 'get',
    params: query
  });
}

export function findArticleDownLoadById(query) {
  return request({
    url: '/article/article/download/findArticleDownLoadById',
    method: 'get',
    params: query
  });
}

export function insertArticleDownLoad(data) {
  return request({
    url: '/article/article/download/insertArticleDownLoad',
    method: 'post',
    data
  });
}

export function updateArticleDownLoad(data) {
  return request({
    url: '/article/article/download/updateArticleDownLoad',
    method: 'post',
    data
  });
}

export function deleteArticleDownLoad(query) {
  return request({
    url: '/article/article/download/deleteArticleDownLoad',
    method: 'get',
    params: query
  });
}
