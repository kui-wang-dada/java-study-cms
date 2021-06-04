/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout';

const studyRouter = {
  path: '/study',
  component: Layout,
  redirect: '/study/list',
  name: 'Study',
  meta: {
    title: 'java学习',
    icon: 'article'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/study'),
      name: 'StudyList',
      meta: { title: 'java学习列表' }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/study/detail'),
      name: 'StudyDetail',
      meta: { title: 'java学习详情', noCache: true },
      hidden: true
    },
    {
      path: 'create',
      component: () => import('@/views/study/edit'),
      name: 'StudyCreate',
      meta: { title: '创建java学习', activeMenu: '/study/list' },
      hidden: true
    },
    {
      path: 'edit/:id',
      component: () => import('@/views/study/edit'),
      name: 'StudyEdit',
      meta: { title: '资料java学习', noCache: true, activeMenu: '/study/list' },
      hidden: true
    }
  ]
};
export default studyRouter;
