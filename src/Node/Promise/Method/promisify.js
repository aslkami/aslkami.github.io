const utils = require('util');
// utils.promisify('fs')

const fs = require('fs').promises;

function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  };
}

function promisifyAll(modules) {
  let result;
  for (let key in modules) {
    result[key] = typeof modules[key] === 'function' ? promisify(modules[key]) : modules[key];
  }
  return result;
}
