const fs = require('fs');
// 默认配置
const defaultConfig = {
  img: '.png,.gif',
  cmd: '',
  cmd2: '',
};

exports.readConfig = () => new Promise((resolve, reject) => {
  fs.readFile('./config.json', 'utf-8', (err, data) => {
    if (err) {
      resolve(defaultConfig);
    }
    try {
      resolve({ ...JSON.parse(data), ...defaultConfig });
    } catch {
      reject('读取配置文件失败');
    }
  })
});

exports.readFile = (name) => new Promise((resolve, reject) => {
  fs.readFile(`./tmp/${name}`, 'utf-8', (err, data) => {
    if (err) {
      reject('文件读取失败');
    }
    resolve(data);
  })
});