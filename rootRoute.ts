import BaseRoute from './src/Base/route';
import NodeRoute from './src/Node/route';
import OperationMaintenanceRoute from './src/OperationMaintenance/route';
import PackToolRoute from './src/PackTool/route';

export default {
  navs: [
    ...BaseRoute.navs,
    ...NodeRoute.navs,
    ...OperationMaintenanceRoute.navs,
    ...PackToolRoute.navs,
    {
      title: '问题汇总',
      path: '/question',
    },
    {
      title: 'Vue',
      path: 'https://aslkami-vue.netlify.app/',
    },
    {
      title: '博客',
      children: [
        {
          title: 'gatsby 博客',
          path: 'https://aslkami.gatsbyjs.io',
        },
        {
          title: 'hexo 博客',
          path: 'https://aslkami.netlify.app',
        },
        {
          title: '基金学习',
          path: '/fund',
        },
      ],
    },
    {
      title: 'GitHub',
      path: 'https://github.com/aslkami/aslkami.github.io',
    },
  ],
  menus: {
    ...BaseRoute.menus,
    ...NodeRoute.menus,
    // ...OperationMaintenanceRoute.menus,
  },
};
