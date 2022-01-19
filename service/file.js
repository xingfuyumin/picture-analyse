const fs = require('fs');
const path = require('path');

exports.readFile = (name) => new Promise((resolve, reject) => {
  fs.readFile(`./${name}`, 'utf-8', (err, data) => {
    if (err) {
      reject('文件读取失败');
    }
    resolve(data);
  })
});

exports.readDir = (name) => new Promise((resolve, reject) => {
  fs.readdir(`./${name}/`, {}, (err, data) => {
    if (err) {
      reject('目录读取失败');
    }
    resolve(data);
  })
});

exports.getRootDir = () => new Promise((resolve) => {
  resolve(path.resolve('./'));
});