/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout';

const ArticleRouter = {
  path: '/article',
  component: Layout,
  redirect: '/article/list',
  name: 'Article',
  meta: {
    title: '文章管理',
    icon: 'article'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/article'),
      name: 'ArticleList',
      meta: { title: '文章列表' }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/article/detail'),
      name: 'ArticleDetail',
      meta: { title: '文章详情', noCache: true },
      hidden: true
    },
    {
      path: 'create',
      component: () => import('@/views/article/edit'),
      name: 'ArticleCreate',
      meta: { title: '创建文章', activeMenu: '/article/list' },
      hidden: true
    },
    {
      path: 'edit/:id',
      component: () => import('@/views/article/edit'),
      name: 'ArticleEdit',
      meta: { title: '文章编辑', noCache: true, activeMenu: '/article/list' },
      hidden: true
    },
    {
      path: 'label',
      component: () => import('@/views/article/label'),
      name: 'ArticleLabel',
      meta: {
        title: '文章标签管理',
        noCache: true,
        activeMenu: '/article/list'
      }
    },
    {
      path: 'labelEdit',
      component: () => import('@/views/article/labelEdit'),
      name: 'ArticleLabelEdit',
      meta: {
        title: '创建文章标签',
        noCache: true,
        activeMenu: '/article/list'
      },
      hidden: true
    }
  ]
};
export default ArticleRouter;
