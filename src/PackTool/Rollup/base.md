---
title: 模拟实现
order: 2
---

- 大致目录结果

```
├── package.json
├── README.md
├── debugger.js
├── src
    ├── ast
    │   ├── analyse.js //分析AST节点的作用域和依赖项
    │   ├── Scope.js //有些语句会创建新的作用域实例
    │   └── walk.js //提供了递归遍历AST语法树的功能
    ├── Bundle//打包工具，在打包的时候会生成一个Bundle实例，并收集其它模块，最后把所有代码打包在一起输出
    │   └── index.js
    ├── Module//每个文件都是一个模块
    │   └── index.js
    ├── rollup.js //打包的入口模块
    └── utils
        └── index.js
```

- `src/main.js`

```js
console.log('hello');
```

- `debugger.js`

```js
const path = require('path');
const rollup = require('./src/rollup');
let entry = path.resolve(__dirname, 'src/main.js');
rollup(entry, 'bundle.js');
```

- `rollup.js`

```js
const Bundle = require('./bundle');
function rollup(entry, filename) {
  const bundle = new Bundle({ entry });
  bundle.build(filename);
}
module.exports = rollup;
```

- `bundle.js`

```js
let fs = require('fs');
let path = require('path');
let Module = require('./module');
let MagicString = require('magic-string');
class Bundle {
  constructor(options) {
    //入口文件数据
    this.entryPath = path.resolve(options.entry.replace(/\.js$/, '') + '.js');
    //存放所有的模块
    this.modules = {};
  }
  build(filename) {
    const entryModule = this.fetchModule(this.entryPath); //获取模块代码
    this.statements = entryModule.expandAllStatements(true); //展开所有的语句
    const { code } = this.generate(); //生成打包后的代码
    fs.writeFileSync(filename, code); //写入文件系统
  }
  fetchModule(importee) {
    let route = importee;
    if (route) {
      let code = fs.readFileSync(route, 'utf8');
      const module = new Module({
        code,
        path: importee,
        bundle: this,
      });
      return module;
    }
  }
  generate() {
    let magicString = new MagicString.Bundle();
    this.statements.forEach((statement) => {
      const source = statement._source.clone();
      magicString.addSource({
        content: source,
        separator: '\n',
      });
    });
    return { code: magicString.toString() };
  }
}
module.exports = Bundle;
```

- `module.js`

```js
const MagicString = require('magic-string');
const { parse } = require('acorn');
let analyse = require('./ast/analyse');
class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code, { filename: path });
    this.path = path;
    this.bundle = bundle;
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: 'module',
    });
    analyse(this.ast, this.code, this);
  }
  expandAllStatements() {
    let allStatements = [];
    this.ast.body.forEach((statement) => {
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  expandStatement(statement) {
    statement._included = true;
    let result = [];
    result.push(statement);
    return result;
  }
}
module.exports = Module;
```

- `analyse.js`

```js
function analyse(ast, code, module) {
  //给statement定义属性
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      _module: { value: module },
      _source: { value: code.snip(statement.start, statement.end) },
    });
  });
}
module.exports = analyse;
```
