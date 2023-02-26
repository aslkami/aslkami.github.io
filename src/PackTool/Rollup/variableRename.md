---
title: 实现变量重命名
order: 6
---

- `main.js`

```js
import { age1 } from './age1.js';
import { age2 } from './age2.js';
import { age3 } from './age3.js';
console.log(age1, age2, age3);

/**
const age$2 = '年龄';
const age1 = age$2 + '1';

const age$1 = '年龄';
const age2 = age$1 + '2';

const age = '年龄';
const age3 = age + '3';

console.log(age1, age2, age3);
 */
```

- `age1.js age2.js age3.js`

```js
const age = '年龄';
export const age1 = age + '1';

const age = '年龄';
export const age2 = age + '2';

const age = '年龄';
export const age3 = age + '3';
```

- `utils.js`

```js
+const walk = require('./ast/walk');
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
exports.hasOwnProperty = hasOwnProperty;
+function replaceIdentifiers(statement, source, replacements) {
+  walk(statement, {
+    enter(node) {
+      if (node.type === 'Identifier') {
+        if (node.name && replacements[node.name]) {
+          source.overwrite(node.start, node.end, replacements[node.name]);
+        }
+      }
+    }
+  })
+}
+exports.replaceIdentifiers = replaceIdentifiers;
```

- `bundle.js`

```js
let fs = require('fs');
let path = require('path');
let Module = require('./module');
let MagicString = require('magic-string');
+const { hasOwnProperty, replaceIdentifiers } = require('./utils');
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
+   this.deconflict();
    const { code } = this.generate();//生成打包后的代码
    fs.writeFileSync(filename, code);//写入文件系统
    console.log('done');
  }
+ deconflict() {
+   const defines = {};//定义的变量
+   const conflicts = {};//变量名冲突的变量
+   this.statements.forEach(statement => {
+     Object.keys(statement._defines).forEach(name => {
+       if (hasOwnProperty(defines, name)) {
+         conflicts[name] = true;
+       } else {
+         defines[name] = [];//defines.age = [];
+       }
+       //把此声明变量的语句，对应的模块添加到数组里
+       defines[name].push(statement._module);
+     });
+   });
+   Object.keys(conflicts).forEach(name => {
+     const modules = defines[name];//获取定义此变量名的模块的数组
+     modules.pop();//最后一个模块不需要重命名,保留 原来的名称即可 [age1,age2]
+     modules.forEach((module, index) => {
+       let replacement = `${name}$${modules.length - index}`;
+       debugger
+       module.rename(name, replacement);//module age=>age$2
+     });
+   });
+ }
  fetchModule(importee, importer) {
    let route;
    if (!importer) {
      route = importee;
    } else {
      if (path.isAbsolute(importee)) {
        route = importee;
      } else {
        route = path.resolve(path.dirname(importer), importee.replace(/\.js$/, '') + '.js');
      }
    }
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
+     let replacements = {};
+     Object.keys(statement._dependsOn)
+       .concat(Object.keys(statement._defines))
+       .forEach(name => {
+         const canonicalName = statement._module.getCanonicalName(name);
+         if (name !== canonicalName)
+           replacements[name] = canonicalName;
+       });
      const source = statement._source.clone();
      if (statement.type === 'ExportNamedDeclaration') {
        source.remove(statement.start, statement.declaration.start);
      }
+     replaceIdentifiers(statement, source, replacements);
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

- `module.js`

```js
const MagicString = require('magic-string');
const { parse } = require('acorn');
const { hasOwnProperty } = require('./utils');
const analyse = require('./ast/analyse');
const SYSTEMS = ['console', 'log'];
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
    this.modifications = {};
+   this.canonicalNames = {};
    analyse(this.ast, this.code, this);
  }
  expandAllStatements() {
    let allStatements = [];
    this.ast.body.forEach(statement => {
      if (statement.type === 'ImportDeclaration') return;
      if (statement.type === 'VariableDeclaration') return;
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
    //找到此语句定义的变量,把定义的变量和修改语句也包括进来
    //注意要先定义再修改，所以要把这行放在push(statement)的下面
    const defines = Object.keys(statement._defines);
    defines.forEach(name => {
      //找到定义的变量依赖的修改的语句
      const modifications = hasOwnProperty(this.modifications, name) && this.modifications[name];
      if (modifications) {
        //把修改语句也展开放到结果里
        modifications.forEach(statement => {
          if (!statement._included) {
            let statements = this.expandStatement(statement);
            result.push(...statements);
          }
        });
      }
    });
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
      if (statement) {
        if (statement._included) {
          return [];
        } else {
          return this.expandStatement(statement);
        }
      } else {
        if (SYSTEMS.includes(name)) {
          return [];
        } else {
          throw new Error(`变量${name}既没有从外部导入，也没有在当前的模块声明`);
        }
      }
    }
  }
+ rename(name, replacement) {
+   this.canonicalNames[name] = replacement;
+ }
+ getCanonicalName(name) {
+   return this.canonicalNames[name] || name;
+ }
}
module.exports = Module;
```
