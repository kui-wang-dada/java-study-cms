import request from '@/utils/request';

// 获取目录
export function getSelectCategory(query) {
  return request({
    url: '/article/article/learn/selectCategory',
    method: 'get',
    params: query
  });
}

// 添加分类 or 修改分类
export function insertCategory(data) {
  return request({
    url: '/article/article/learn/insertCategory',
    method: 'post',
    data
  });
}

// 删除分类
export function deleteCategory(query) {
  return request({
    url: '/article/article/learn/deleteCategory',
    method: 'get',
    params: query
  });
}

// 创建文章
export function insertArticleLearn(data) {
  return request({
    url: '/article/article/learn/insertArticleLearn',
    method: 'post',
    data
  });
}

// 编辑文章
export function updateArticleLearn(data) {
  return request({
    url: '/article/article/learn/updateArticleLearn',
    method: 'post',
    data
  });
}

// 根据目录id查询文章
export function selectArticleLearnList(query) {
  return request({
    url: '/article/article/learn/selectArticleLearnList',
    method: 'get',
    params: query
  });
}

// 根据目录id删除文章
export function deleteArticleLearn(query) {
  return request({
    url: '/article/article/learn/deleteArticleLearn',
    method: 'get',
    params: query
  });
}
