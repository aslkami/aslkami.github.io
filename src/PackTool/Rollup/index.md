---
title: 前置知识
order: 1
---

## 初始化项目

```shell
npm install rollup magic-string acorn --save
```

## magic-string

magic-string 是一个操作字符串和生成 source-map 的工具

```js
var MagicString = require('magic-string');
let sourceCode = `export var name = "zhufeng"`;
let ms = new MagicString(sourceCode);
console.log(ms);
//裁剪出原始字符串开始和结束之间所有的内容
//返回一个克隆后的MagicString的实例
console.log(ms.snip(0, 6).toString()); //sourceCode.slice(0,6);
//删除0, 7之间的内容
console.log(ms.remove(0, 7).toString()); //sourceCode.slice(7);

//还可以用用来合并代码 //TODO
let bundle = new MagicString.Bundle();
bundle.addSource({
  content: 'var a = 1;',
  separator: '\n',
});
bundle.addSource({
  content: 'var b = 2;',
  separator: '\n',
});
console.log(bundle.toString());
```

## acorn

AST 转化的工具

[astexplorer](https://astexplorer.net/) 可以把代码转成语法树

acorn 解析结果符合 The Estree Spec 规范

- walk.js

```js
function walk(astNode, { enter, leave }) {
  visit(astNode, null, enter, leave);
}
function visit(node, parent, enter, leave) {
  if (enter) {
    enter.call(null, node, parent);
  }
  let keys = Object.keys(node).filter((key) => typeof node[key] === 'object');
  keys.forEach((key) => {
    let value = node[key];
    if (Array.isArray(value)) {
      value.forEach((val) => visit(val, node, enter, leave));
    } else if (value && value.type) {
      visit(value, node, enter, leave);
    }
  });
  if (leave) {
    leave.call(null, node, parent);
  }
}

module.exports = walk;
```

- 使用 use.js

```js
const acorn = require('acorn');
const walk = require('./walk');
const sourceCode = 'import $ from "jquery"';
const ast = acorn.parse(sourceCode, {
  sourceType: 'module',
  ecmaVersion: 8,
});
let indent = 0;
const padding = () => ' '.repeat(indent);
ast.body.forEach((statement) => {
  walk(statement, {
    enter(node) {
      if (node.type) {
        console.log(padding() + node.type + '进入');
        indent += 2;
      }
    },
    leave(node) {
      if (node.type) {
        indent -= 2;
        console.log(padding() + node.type + '离开');
      }
    },
  });
});

// ImportDeclaration进入
//   ImportDefaultSpecifier进入
//     Identifier进入
//     Identifier离开
//   ImportDefaultSpecifier离开
//   Literal进入
//   Literal离开
// ImportDeclaration离开
```

遍历是深度遍历的

## 作用域

- scope.js

```js
class Scope {
  constructor(options = {}) {
    //作用域的名称
    this.name = options.name;
    //父作用域
    this.parent = options.parent;
    //此作用域内定义的变量
    this.names = options.names || [];
  }
  add(name) {
    this.names.push(name);
  }
  findDefiningScope(name) {
    if (this.names.includes(name)) {
      return this;
    } else if (this.parent) {
      return this.parent.findDefiningScope(name);
    } else {
      return null;
    }
  }
}
module.exports = Scope;
```

- 使用 useScope.js

```js
var a = 1;
function one() {
  var b = 1;
  function two() {
    var c = 2;
    console.log(a, b, c);
  }
}
let Scope = require('./scope');
let globalScope = new Scope({ name: 'global', names: [], parent: null });
let oneScope = new Scope({ name: 'one', names: ['b'], parent: globalScope });
let twoScope = new Scope({ name: 'two', names: ['c'], parent: oneScope });
console.log(
  threeScope.findDefiningScope('a').name,
  threeScope.findDefiningScope('b').name,
  threeScope.findDefiningScope('c').name,
);
```
