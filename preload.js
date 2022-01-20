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
  const str = message;
  window.rootDir = str;
})
