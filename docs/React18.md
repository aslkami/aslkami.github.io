### jsx

```js
let element = (
  <h1>
    hello<span style={{ color: 'red' }}>world</span>
  </h1>
);

const { hasOwnProperty } = Object.prototype;
const REACT_ELEMENT_TYPE = Symbol.for('react.element');

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};
function hasValidRef(config) {
  return config.ref !== undefined;
}

const ReactElement = (type, key, ref, props) => {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
  };
  return element;
};

export function jsxDEV(type, config, maybeKey) {
  let propName;
  const props = {};
  let key = null;
  let ref = null;

  if (maybeKey !== undefined) {
    key = '' + maybeKey;
  }

  if (hasValidRef(config)) {
    ref = config.ref;
  }

  for (propName in config) {
    if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
      props[propName] = config[propName];
    }
  }
  return ReactElement(type, key, ref, props);
}

console.log(element);
```

### 简约流程

1. 创建 容器根节点

```js
const root = createRoot(document.getElementById('root'));
```

- 在 render 之前，生成了根节点 `_internalRoot`, 内涵 2 个属性 `containerInfo` 和 `current`
- containerInfo 指向 root 的 dom 节点(FiberRootNode)
- current 指向 根 fiber(HostRootFiber)
- 创建 根 fiber 的时候，初始化了更新队列 initializeUpdateQueue

  ```js
  export function initializeUpdateQueue(fiber) {
    const queue = {
      shared: {
        pending: null,
      },
    };
    fiber.updateQueue = queue;
  }
  ```

2. 渲染 children

```js
ReactDOMRoot.prototype.render = function render(children) {
  const root = this._internalRoot;
  root.containerInfo.innerHTML = '';
  updateContainer(children, root);
};

// 创建 一个 update 对象 payload 指向 element 也就是 h1 的虚拟 dom
export function updateContainer(element, container) {
  const current = container.current; // 根 fiber
  const update = createUpdate();
  update.payload = { element };
  const root = enqueueUpdate(current, update);
  console.log(root);
}

const UpdateState = 0;
export function createUpdate() {
  const update = { tag: UpdateState };
  return update;
}
// 构建循环链表，构建更新队列，并赋值到  根 fiber 的更新队列上
// 通过 fiber 找到 根节点
export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const sharedQueue = updateQueue.shared;
  const pending = sharedQueue.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  updateQueue.shared.pending = update;
  return markUpdateLaneFromFiberToRoot(fiber);
}

const HostRoot = 3;
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber;
  let parent = sourceFiber.return;
  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }
  if (node.tag === HostRoot) {
    const root = node.stateNode;
    return root;
  }
  return null;
}
```

updateContainer

- 更新 fiber 的更新队列，构建 环状链表

3. 任务调度更新

```js
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  return workInProgress;
}
```

- renderRootSync 最初同步渲染根节点, 构建 fiber 🌲 树
  - `prepareFreshStack,createWorkInProgress`, 创建新的 `fiber` 数 并有一个 `alternate` 属性，新老 `fiber` 互相指向
- performUnitOfWork、beginWork 阶段
  - updateHostRoot
  - processUpdateQueue，计算 循环链表所有的 更新数据，并赋值 给 新 fiber 的 memoizedState 上
  - reconcileChildren
  ```js
  function getStateFromUpdate(update, prevState) {
    switch (update.tag) {
      case UpdateState: {
        const { payload } = update;
        const partialState = payload;
        return assign({}, prevState, partialState);
      }
      default:
        return prevState;
    }
  }
  export function processUpdateQueue(workInProgress) {
    const queue = workInProgress.updateQueue;
    const pendingQueue = queue.shared.pending;
    if (pendingQueue !== null) {
      queue.shared.pending = null;
      const lastPendingUpdate = pendingQueue;
      const firstPendingUpdate = lastPendingUpdate.next;
      lastPendingUpdate.next = null;
      let newState = workInProgress.memoizedState;
      let update = firstPendingUpdate;
      while (update) {
        newState = getStateFromUpdate(update, newState);
        update = update.next;
      }
      workInProgress.memoizedState = newState;
    }
  }
  ```
- completeUnitOfWork、completedWork 完成阶段
  - beginWork 每进入到最后一个节点，就会完成该节点
  - completedWork 归并副作用，生成真实 dom
  - 对于初次渲染，一个节点是新的，那么其子节点都是新的
  - beginWork 是构建子 fiber，completedWork 会生成 dom，生成文本节点或把属性挂载 到 dom 上，最后改变父级的 subtreeflag，就像层层汇报一样，最后提交至 根
- commitRoot 提交阶段 commitMutationEffectsOnFiber
  - 处理归并的 fiber， 生成真实 dom
  - 最后将 新的 fiber 树 赋予 给 current

```

```
