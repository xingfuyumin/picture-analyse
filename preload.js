const { readDir, readFile, getRootDir } = require('./service/file');
const { shell } = require('./service/command');
const { ipcRenderer } = require('electron');

window.request = async (type, ...params) => {
  switch (type) {
    case 'file/readDir': return (await readDir(window.rootDir, ...params));
    case 'file/readFile': return (await readFile(window.rootDir, ...params));
    case 'file/getRootDir': return (await getRootDir(window.rootDir));
    case 'command/shell': return (await shell(...params));
    default: throw '接口不存在';
  };
};
ipcRenderer.on('path', (event, message) => {
  let str = message;
  if (str.split('\\').find(v => v.includes('.exe'))) {
    str = str.split('\\').filter(v => !v.includes('.exe')).join('\\');
  }
  window.rootDir = str;
})
