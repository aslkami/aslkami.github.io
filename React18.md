1. 创建 容器根节点

- containerInfo 指向 root 的 dom 节点
- current 指向 根 fiber

2. 渲染 children

- 更新 fiber 的更新队列，构建 环状链表

3. 任务调度更新

- renderRootSync 最初同步渲染根节点, 构建 fiber 🌲 树
- performUnitOfWork、beginWork 阶段
  - 创建 workInProgress, 基于老的 fiber 树，构建新的 fiber 树
  - 开始工作循环 workLoop
  - 拿到 新 fiber 对应的 老节点，构建 子 fiber 树
  - fiber.child、 fiber.sibling、fiber.return
- completeUnitOfWork、completedWork 完成阶段
  - 归并副作用，生成真实 dom
- commitRoot 提交阶段 commitMutationEffectsOnFiber
  - 处理归并的 fiber， 生成真实 dom
  - 最后将 新的 fiber 树 赋予 给 current
