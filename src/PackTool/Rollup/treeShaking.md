---
title: tree-shaking
order: 3
---

基本原理

其实就是通过语法树分析哪些用到了，把哪些代码收集起来

- 第一步
  - 在 module 里收集 imports、exports 和 definitions
  - 在 analyse 收集\_defines 和\_dependsOn
- 第二步

  - 重构 expandAllStatements

- 基本语句

```js
//存放本模块导入了哪些变量
this.imports = {};
// 存放本模块导出了哪些变量
this.exports = {};
//存放本模块的定义变量的语句
this.definitions = {};
//此变量存放所有的变量修改语句,key是变量名，值是一个数组
this.modifications = {}; //{name:[name+='jiagou'],age:'age++'}
//记得重命名的变量{key老的变量名:value新的变量名}
this.canonicalNames = {}; //{age:'age$1'}
//本模块从哪个模块导入了什么变量，在当前模块内叫什么名字
//this.imports.name = {'./msg','name'};
this.imports[localName] = { source, importName };
//本模块导出了哪个变量，对应哪个本地变量
//this.exports.name = {localName:'name'};
this.exports[exportName] = { localName };
//本顶级语句定义的变量
statement._defines[name] = true;
//定义变量的语句
this.definitions[name] = statement;
//本语句用到的变量
statement._dependsOn[name] = true;
//从模块中获取定义变量的语句
module.define(name);
```

- `src/main.js`

```js
import { name, age } from './msg';
function say() {
  console.log('hello', name);
}
say();
```

- `src/msg.js`

```js
export var name = 'zhufeng';
export var age = 12;
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
    const entryModule = this.fetchModule(this.entryPath);//获取模块代码
    this.statements = entryModule.expandAllStatements(true);//展开所有的语句
    const { code } = this.generate();//生成打包后的代码
    fs.writeFileSync(filename, code);//写入文件系统
  }
  fetchModule(importee, importer) {
+   let route;
+   if (!importer) {
+     route = importee;
+   } else {
+     if (path.isAbsolute(importee)) {
+       route = importee;
+     } else {
+       route = path.resolve(path.dirname(importer), importee.replace(/\.js$/, '') + '.js');
+     }
+   }
    if (route) {
      let code = fs.readFileSync(route, 'utf8');
      const module = new Module({
        code,
        path: importee,
        bundle: this
      })
      return module;
    }
  }
  generate() {
    let magicString = new MagicString.Bundle();
    this.statements.forEach(statement => {
      const source = statement._source.clone();
+     if (statement.type === 'ExportNamedDeclaration') {
+       source.remove(statement.start, statement.declaration.start);
+     }
      magicString.addSource({
        content: source,
        separator: '\n'
      })
    })
    return { code: magicString.toString() }
  }
}
module.exports = Bundle;
```

- `utils.js`

```js
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
exports.hasOwnProperty = hasOwnProperty;
```

- `module.js`

```js
const MagicString = require('magic-string');
const { parse } = require('acorn');
+const { hasOwnProperty } = require('./utils');
const analyse = require('./ast/analyse');
class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code, { filename: path });
    this.path = path;
    this.bundle = bundle;
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: 'module'
    })
+   //存放本模块的导入信息
+   this.imports = {};
+   //本模块的导出信息
+   this.exports = {};
+   //存放本模块的定义变量的语句 a=>var a = 1;b =var b =2;
+   this.definitions = {};
    analyse(this.ast, this.code, this);
  }
  expandAllStatements() {
    let allStatements = [];
    this.ast.body.forEach(statement => {
+     //导入的语句默认全部过滤掉
+     if (statement.type === 'ImportDeclaration') return;
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  expandStatement(statement) {
    statement._included = true;
    let result = [];
+   //获取此语句依赖的变量
+   let _dependsOn = Object.keys(statement._dependsOn);
+   _dependsOn.forEach(name => {
+     //找到此变量定义的语句，添加到输出数组里
+     let definitions = this.define(name);
+     result.push(...definitions);
+   });
    //把此语句添加到输出列表中
    result.push(statement);
    return result;
  }
+ define(name) {
+   //先判断此变量是外部导入的还是模块内声明的
+   if (hasOwnProperty(this.imports, name)) {
+     //说明此变量不是模块内声明的，而是外部导入的,获取从哪个模块内导入了哪个变量
+     const { source, importName } = this.imports[name];
+     //获取这个模块
+     const importModule = this.bundle.fetchModule(source, this.path);
+     //从这个模块的导出变量量获得本地变量的名称
+     const { localName } = importModule.exports[importName];
+     //获取本地变量的定义语句
+     return importModule.define(localName);//name
+   } else {//如果是模块的变量的话
+     let statement = this.definitions[name];//name
+     if (statement && !statement._included) {
+       //如果本地变量的话还需要继续展开
+       return this.expandStatement(statement);
+     } else {
+       return []
+     }
+   }
+ }
}
module.exports = Module;
```

- `analyse.js`

第 1 个循环 找出导入导出的变量

第 2 个循环 找出定义和依赖的变量

```js
+const Scope = require('./scope');
+const walk = require('./walk');
+const { hasOwnProperty } = require('../utils');
+function analyse(ast, code, module) {
+  //第1个循环，找出导入导出的变量
+  ast.body.forEach(statement => {
+    Object.defineProperties(statement, {
       _module: { value: module }
       _source: { value: code.snip(statement.start, statement.end) },
+      _defines: { value: {} },//此节点上定义的变量say
+      _dependsOn: { value: {} }//此此节点读取了哪些变量
+    })
+    //import { name, age } from './msg';
+    if (statement.type === 'ImportDeclaration') {
+      let source = statement.source.value;// ./msg
+      statement.specifiers.forEach(specifier => {
+        let importName = specifier.imported.name;//导入的变量名
+        let localName = specifier.local.name;//本地的变量名
+        //imports.name = {source:'./msg',importName:'name'};
+        module.imports[localName] = { source, importName }
+      });
+    } else if (statement.type === 'ExportNamedDeclaration') {
+      const declaration = statement.declaration;
+      if (declaration && declaration.type === 'VariableDeclaration') {
+        const declarations = declaration.declarations;
+        declarations.forEach(variableDeclarator => {
+          const localName = variableDeclarator.id.name;//name
+          const exportName = localName;
+          //exports.name = {localName:'name'};
+          module.exports[exportName] = { localName };
+        });
+      }
+    }
+  });
+  //第2次循环创建作用域链
+  let currentScope = new Scope({ name: '全局作用域' });
+  //创建作用域链,为了知道我在此模块中声明哪些变量，这些变量的声明节点是哪个 var name = 1;
+  ast.body.forEach(statement => {
+    function addToScope(name) {
+      currentScope.add(name);//把name变量放入当前的作用域
+      //如果没有父亲，相当 于就是根作用域或者 当前的作用域是一个块级作用域的话
+      if (!currentScope.parent) {//如果没有父作用域，说明这是一个顶级作用域
+        statement._defines[name] = true;//在一级节点定义一个变量name _defines.say=true
+        module.definitions[name] = statement;
+      }
+    }
+    walk(statement, {
+      enter(node) {
+        //收集本节点上使用的变量
+        if (node.type === 'Identifier') {
+          statement._dependsOn[node.name] = true;
+        }
+        let newScope;
+        switch (node.type) {
+          case 'FunctionDeclaration':
+            addToScope(node.id.name);//say
+            const names = node.params.map(param => param.name);
+            newScope = new Scope({ name: node.id.name, parent: currentScope, names });
+            break;
+          case 'VariableDeclaration':
+            node.declarations.forEach(declaration => {
+              addToScope(declaration.id.name);//var
+            });
+            break;
+          default:
+            break;
+        }
+        if (newScope) {
+          Object.defineProperty(node, '_scope', { value: newScope });
+          currentScope = newScope;
+        }
+      },
+      leave(node) {
+        if (hasOwnProperty(node, '_scope')) {
+          currentScope = currentScope.parent;
+        }
+      }
+    });
+  });
+}
module.exports = analyse;
```

- `scope.js`

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

- `walk.js`

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
