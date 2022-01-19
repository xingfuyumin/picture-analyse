const { readDir, readFile, getRootDir } = require('./service/file');
const { shell } = require('./service/command');

window.request = async (type, ...params) => {
  switch (type) {
    case 'file/readDir': return (await readDir(...params));
    case 'file/readFile': return (await readFile(...params));
    case 'file/getRootDir': return (await getRootDir());
    case 'command/shell': return (await shell(...params));
    default: throw '接口不存在';
  };
};