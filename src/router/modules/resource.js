/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout';

const resourceRouter = {
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
    {
      path: 'detail/:id',
      component: () => import('@/views/resource/detail'),
      name: 'ResourceDetail',
      meta: { title: '资料详情', noCache: true },
      hidden: true
    },
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
export default resourceRouter;
