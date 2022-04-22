const fs = require('fs');
const path = require('path');
const vm = require('vm');

function Module(id) {
  this.id = id;
  this.exports = {};
}
Module.wrapper = [`(function(exports,require,module,__filename,__dirname){`, `})`];
Module._extensions = {
  '.js'(module) {
    let content = fs.readFileSync(module.id, 'utf8');
    content = Module.wrapper[0] + content + Module.wrapper[1];
    let fn = vm.runInThisContext(content);
    let exports = module.exports;
    let dirname = path.dirname(module.id);
    fn.call(exports, exports, req, module, module.id, dirname);
  },
  '.json'(module) {
    let content = fs.readFileSync(module.id, 'utf8');
    module.exports = JSON.parse(content);
  },
};
Module._resolveFilename = function (filename) {
  let absPath = path.resolve(__dirname, filename);
  let isExists = fs.existsSync(absPath);
  if (isExists) {
    return absPath;
  } else {
    let keys = Object.keys(Module._extensions);
    for (let i = 0; i < keys.length; i++) {
      let newPath = absPath + keys[i];
      let flag = fs.existsSync(newPath);
      if (flag) {
        return newPath;
      }
    }
    throw new Error('module not exists');
  }
};
Module.prototype.load = function () {
  let extName = path.extname(this.id);
  Module._extensions[extName](this);
};
Module._cache = {};

function req(filename) {
  filename = Module._resolveFilename(filename);
  let cacheModule = Module._cache[filename];
  if (cacheModule) {
    return cacheModule.exports;
  }
  let module = new Module(filename);
  Module._cache[filename] = module;
  module.load();
  return module.exports;
}
