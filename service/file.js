const fs = require('fs');
const path = require('path');

exports.readFile = (rootDir, name) => new Promise((resolve, reject) => {
  console.log(`${rootDir}/${name}`);
  fs.readFile(`${rootDir}/${name}`, 'utf-8', (err, data) => {
    if (err) {
      reject('文件读取失败');
    }
    resolve(data);
  })
});

exports.readDir = (rootDir, name) => new Promise((resolve, reject) => {
  fs.readdir(`${rootDir}/${name}/`, {}, (err, data) => {
    if (err) {
      reject('目录读取失败');
    }
    resolve(data);
  })
});

exports.getRootDir = (rootDir) => new Promise((resolve) => {
  resolve(rootDir);
});
