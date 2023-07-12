const spawn = require('cross-spawn');

function install(options) {
  // command 指 yarn 或者 npm
  // cwd 是要安装依赖的那个项目目录
  const {command, cwd} = options;
  return new Promise((resolve, reject) => {
    const args = ['install', '--save', '--save-exact', '--loglevel', 'error']
    const child = spawn(command, args, {
      cwd,
      stdio: ['pipe', process.stdout, process.stderr],
    })

    child.once('close', (code) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        })
        return
      }
      resolve(options)
    })
    child.once('error', reject)
  })
}
exports.install = install