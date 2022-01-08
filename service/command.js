const exec = require('child_process').exec;

exports.shell = (cmd) => new Promise((resolve, reject) => {
    exec(cmd, (err,stdout) => {
        if(err) {
            reject('程序计算错误！');
        } else {
            resolve(stdout);
        }
    });
});

