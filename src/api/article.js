import request from '@/utils/request';

export function fetchList(query) {
  return request({
    url: '/article/home/selectArticleHome',
    method: 'get',
    params: query
  });
}

export function fetchArticle(query) {
  return request({
    url: '/article/home/selectArticleHomeById',
    method: 'get',
    params: query
  });
}

export function createArticle(data) {
  return request({
    url: '/article/home/insertArticleHome',
    method: 'post',
    data
  });
}

export function updateArticle(data) {
  return request({
    url: '/article/home/updateArticleHome',
    method: 'post',
    data
  });
}

export function deleteArticle(query) {
  return request({
    url: '/article/home/deleteArticleHome',
    method: 'get',
    params: query
  });
}
