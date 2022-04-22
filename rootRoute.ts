import BaseRoute from './src/Base/route';
import NodeRoute from './src/Node/route';
import OperationMaintenanceRoute from './src/OperationMaintenance/route';

export default {
  navs: [
    ...BaseRoute.navs,
    ...NodeRoute.navs,
    ...OperationMaintenanceRoute.navs,
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
      ],
    },
  ],
  menus: {
    ...BaseRoute.menus,
    ...NodeRoute.menus,
    // ...OperationMaintenanceRoute.menus,
  },
};
