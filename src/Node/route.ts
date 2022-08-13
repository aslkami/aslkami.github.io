export default {
  navs: [
    {
      title: 'Node',
      path: '/node',
      children: [
        {
          title: 'Node 基础',
          path: '/node/base',
        },
        {
          title: 'Promise',
          path: '/node/promise',
        },
      ],
    },
  ],
  menus: {
    '/node': [
      {
        title: 'Node 基础',
        path: '/node/base',
      },
      {
        title: 'Buffer',
        path: '/node/buffer',
      },
      {
        title: '流',
        path: '/node/stream',
        children: [
          '/Node/Stream/readable.md',
          '/Node/Stream/writeable.md',
          '/Node/Stream/pipe.md',
          '/Node/Stream/duplex.md',
          '/Node/Stream/transform.md',
          '/Node/Stream/objectMode.md',
          '/Node/Stream/through2.md',
        ],
      },
      {
        title: '链表',
        path: '/node/link-list',
      },
      {
        title: '树',
        path: '/node/tree',
      },
      {
        title: '浏览器与事件环',
        path: '/node/event-loop',
      },
      {
        title: 'Promise 模拟实现',
        path: '/node/promise',
        children: [
          '/Node/Promise/Base/index.md',
          '/Node/Promise/Chain/index.md',
          '/Node/Promise/Test/index.md',
          '/Node/Promise/Method/index.md',
          '/Node/Promise/Practice/index.md',
        ],
      },
    ],
  },
};
