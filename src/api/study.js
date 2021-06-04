import request from '@/utils/request';

// 获取目录
export function getSelectCategory(query) {
  return request({
    url: '/article/article/learn/selectCategory',
    method: 'get',
    params: query
  });
}

// 添加分类
export function insertCategory(data) {
  return request({
    url: '/article/article/learn/insertCategory',
    method: 'post',
    data
  });
}

// 删除分类
export function deleteCategory(data) {
  return request({
    url: '/article/article/learn/deleteCategory',
    method: 'post',
    data
  });
}
