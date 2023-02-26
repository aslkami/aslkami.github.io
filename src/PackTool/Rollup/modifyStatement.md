---
title: 包含修改语句
order: 4
---

- `main.js`

```js
import { name, age } from './msg';
console.log(name);
```

- `msg.js`

```js
export var name = 'zhufeng';
name += 'jiagou';
export var age = 12;
```

- `module.js`

```js
const MagicString = require('magic-string');
const { parse } = require('acorn');
const { hasOwnProperty } = require('./utils');
let analyse = require('./ast/analyse');
class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code, { filename: path });
    this.path = path;
    this.bundle = bundle;
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: 'module'
    })
    //存放本模块的导入信息
    this.imports = {};
    //本模块的导出信息
    this.exports = {};
    //存放本模块的定义变量的语句 a=>var a = 1;b =var b =2;
    this.definitions = {};
    //存放变量修改语句
+   this.modifications = {};
    analyse(this.ast, this.code, this);
  }
  expandAllStatements() {
    let allStatements = [];
    this.ast.body.forEach(statement => {
      if (statement.type === 'ImportDeclaration') return;
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  expandStatement(statement) {
    statement._included = true;
    let result = [];
    //获取此语句依赖的变量
    let _dependsOn = Object.keys(statement._dependsOn);
    _dependsOn.forEach(name => {
      //找到此变量定义的语句，添加到输出数组里
      let definitions = this.define(name);
      result.push(...definitions);
    });
    //把此语句添加到输出列表中
    result.push(statement);
+   //找到此语句定义的变量,把定义的变量和修改语句也包括进来
+   //注意要先定义再修改，所以要把这行放在push(statement)的下面
+   const defines = Object.keys(statement._defines);
+   defines.forEach(name => {
+     //找到定义的变量依赖的修改的语句
+     const modifications = hasOwnProperty(this.modifications, name) && this.modifications[name];
+     if (modifications) {
+       //把修改语句也展开放到结果里
+       modifications.forEach(statement => {
+         if (!statement._included) {
+           let statements = this.expandStatement(statement);
+           result.push(...statements);
+         }
+       });
+     }
+   });
    return result;
  }
  define(name) {
    //先判断此变量是外部导入的还是模块内声明的
    if (hasOwnProperty(this.imports, name)) {
      //说明此变量不是模块内声明的，而是外部导入的,获取从哪个模块内导入了哪个变量
      const { source, importName } = this.imports[name];
      //获取这个模块
      const importModule = this.bundle.fetchModule(source, this.path);
      //从这个模块的导出变量量获得本地变量的名称
      const { localName } = importModule.exports[importName];
      //获取本地变量的定义语句
      return importModule.define(localName);//name
    } else {//如果是模块的变量的话
      let statement = this.definitions[name];//name
      if (statement && !statement._included) {
        //如果本地变量的话还需要继续展开
        return this.expandStatement(statement);
      } else {
        return []
      }
    }
  }
}
module.exports = Module;
```

- `analyse.js`

```js
const Scope = require('./scope');
const walk = require('./walk');
const { hasOwnProperty } = require('../utils');
function analyse(ast, code, module) {
  //第1个循环，找出导入导出的变量
  ast.body.forEach(statement => {
    Object.defineProperties(statement, {
      _module: { value: module },
      _source: { value: code.snip(statement.start, statement.end) },
      _defines: { value: {} },//此节点上定义的变量say
      _dependsOn: { value: {} },//此此节点读取了哪些变量
+     _modifies: { value: {} },//本语句修改的变量
    })
    //import { name, age } from './msg';
    if (statement.type === 'ImportDeclaration') {
      let source = statement.source.value;// ./msg
      statement.specifiers.forEach(specifier => {
        let importName = specifier.imported.name;//导入的变量名
        let localName = specifier.local.name;//本地的变量名
        //imports.name = {source:'./msg',importName:'name'};
        module.imports[localName] = { source, importName }
      });
    } else if (statement.type === 'ExportNamedDeclaration') {
      const declaration = statement.declaration;
      if (declaration && declaration.type === 'VariableDeclaration') {
        const declarations = declaration.declarations;
        declarations.forEach(variableDeclarator => {
          const localName = variableDeclarator.id.name;//name
          const exportName = localName;
          //exports.name = {localName:'name'};
          module.exports[exportName] = { localName };
        });
      }
    }
  });
  //第2次循环创建作用域链
  let currentScope = new Scope({ name: '全局作用域' });
  //创建作用域链,为了知道我在此模块中声明哪些变量，这些变量的声明节点是哪个 var name = 1;
  ast.body.forEach(statement => {
+   function checkForReads(node) {
+     //如果此节点类型是一个标识符话
+     if (node.type === 'Identifier') {
+       statement._dependsOn[node.name] = true;
+     }
+   }
+   function checkForWrites(node) {
+     function addNode(node) {
+       const name = node.name;
+       statement._modifies[name] = true;//statement._modifies.age = true;
+       if (!hasOwnProperty(module.modifications, name)) {
+         module.modifications[name] = [];
+       }
+       module.modifications[name].push(statement);
+     }
+     if (node.type === 'AssignmentExpression') {
+       addNode(node.left, true);
+     } else if (node.type === 'UpdateExpression') {
+       addNode(node.argument);
+     }
+   }
    function addToScope(name) {
      currentScope.add(name);//把name变量放入当前的作用域
      //如果没有父亲，相当 于就是根作用域或者 当前的作用域是一个块级作用域的话
      if (!currentScope.parent) {//如果没有父作用域，说明这是一个顶级作用域
        statement._defines[name] = true;//在一级节点定义一个变量name _defines.say=true
        module.definitions[name] = statement;
      }
    }
    walk(statement, {
      enter(node) {
-        if (node.type === 'Identifier') {
-          statement._dependsOn[node.name] = true;
-        }
+       //收集本节点上使用的变量
+       checkForReads(node);
+       checkForWrites(node);
        let newScope;
        switch (node.type) {
          case 'FunctionDeclaration':
            addToScope(node.id.name);//say
            const names = node.params.map(param => param.name);
            newScope = new Scope({ name: node.id.name, parent: currentScope, names });
            break;
          case 'VariableDeclaration':
            node.declarations.forEach(declaration => {
              addToScope(declaration.id.name);//var
            });
            break;
          default:
            break;
        }
        if (newScope) {
          Object.defineProperty(node, '_scope', { value: newScope });
          currentScope = newScope;
        }
      },
      leave(node) {
        if (hasOwnProperty(node, '_scope')) {
          currentScope = currentScope.parent;
        }
      }
    });
  });
}
module.exports = analyse;
```
