/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const labelRouter = {
  path: '/label',
  component: Layout,
  redirect: '/label/list',
  name: 'Article',
  meta: {
    title: '文章管理',
    icon: 'article'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/label'),
      name: 'LabelList',
      meta: { title: '文章标签管理' }
    },
    {
        path: 'create',
        component: () => import('@/views/label/edit'),
        name: 'LabelCreate',
        meta: { title: '创建文章标签', activeMenu: '/label/list' },
        // hidden: true
      },
  ]
}
export default labelRouter
