import { defineConfig } from 'dumi';
import rootRoute from './rootRoute';

export default defineConfig({
  title: '安了个装',
  favicon: '/images/hunter.jpeg',
  logo: '/images/hunter.jpeg',
  metas: [
    {
      name: 'keywords',
      content: 'dumi, umijs, aslkami, 安了个装, 樂下独舞, 七步定投',
    },
    {
      name: 'description',
      content: 'dumi, 记录个人js知识点, 七步定投',
    },
  ],
  outputPath: 'docs-dist',
  mode: 'site',
  nodeModulesTransform: {
    type: 'none',
  },
  // mfsu: {},
  fastRefresh: {},
  ssr: {},
  exportStatic: {},
  chunks: ['umi'],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      },
    });
  },
  ...rootRoute,
  // more config: https://d.umijs.org/config
});
