import BaseRoute from './src/Base/route';
import NodeRoute from './src/Node/route';
import OperationMaintenanceRoute from './src/OperationMaintenance/route';
import PackToolRoute from './src/PackTool/route';
import ReactRoute from './src/React/route';
import CSSRoute from './src/CSS/route';

export default {
  navs: [
    ...BaseRoute.navs,
    ...NodeRoute.navs,
    ...OperationMaintenanceRoute.navs,
    ...PackToolRoute.navs,
    ...ReactRoute.navs,
    ...CSSRoute.navs,
    // {
    //   title: 'TS',
    //   path: '/typescript',
    // },
    {
      title: '问题汇总',
      path: '/question',
    },
    {
      title: 'Vue',
      path: 'https://aslkami-vue.netlify.app/',
    },
    {
      title: '隐秘的角落',
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
          title: '投资理财',
          path: '/fund',
        },
        {
          title: '保险',
          path: '/insurance',
        },
        {
          title: 'Z哥',
          path: '/zettaranc',
        },
        {
          title: '计算器',
          path: '/calculator',
        },
        {
          title: '掘金',
          path: 'https://juejin.cn/user/536217405113208',
        },
        {
          title: 'GitHub',
          path: 'https://github.com/aslkami/aslkami.github.io',
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
