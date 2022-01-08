const { readConfig, readFile } = require('./service/file');
const { shell } = require('./service/command');

window.request = async (type, ...params) => {
  switch (type) {
    case 'file/readConfig': return (await readConfig());
    case 'file/readFile': return (await readFile(...params));
    case 'command/shell': return (await shell(...params));
    default: throw '接口不存在';
  };
};