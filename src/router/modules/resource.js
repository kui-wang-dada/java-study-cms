/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout';

const ResourceRouter = {
  path: '/resource',
  component: Layout,
  redirect: '/resource/list',
  name: 'Resource',
  meta: {
    title: '资料下载',
    icon: 'article'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/resource'),
      name: 'ResourceList',
      meta: { title: '资料列表' }
    },
    // {
    //   path: 'detail/:id',
    //   component: () => import('@/views/article/detail'),
    //   name: 'ArticleDetail',
    //   meta: { title: '文章详情', noCache: true },
    //   hidden: true
    // },
    {
      path: 'create',
      component: () => import('@/views/resource/edit'),
      name: 'ResourceCreate',
      meta: { title: '创建资料', activeMenu: '/resource/list' },
      hidden: true
    },
    {
      path: 'edit/:id',
      component: () => import('@/views/resource/edit'),
      name: 'ResourceEdit',
      meta: { title: '资料编辑', noCache: true, activeMenu: '/resource/list' },
      hidden: true
    }
  ]
};
export default ResourceRouter;
