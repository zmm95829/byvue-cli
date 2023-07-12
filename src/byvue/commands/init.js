const program = require("commander")
const download = require("download-git-repo")
const ora = require("ora")
const templateList = require(`${__dirname}/../template`)
const symbols = require("log-symbols")
const chalk = require("chalk")
chalk.level = 1
const { install } = require('../../util/install')
const defaultCommand = "yarn"
const path = require("path")
const inquirer = require("inquirer")

function initTemplate() {
  return new Promise((resolve, reject) => {
    // 当没有输入参数的时候给个提示
    // if (program.args.length < 2) 
    // 不可能进入上面的判断，因为 commander 设置 command 的时候已经要求模板名称必填了

    // 0:init 1:模板名 2:项目名
    let templateName = program.args[1]
    let projectName = program.args[2]

    if (!templateList[templateName]) {
      // 模板不存在，红色显示提示
      console.log(chalk.red(`模板【${templateName}】不存在！`))
      reject();
      return
    }

    if (!projectName || ["-i", "--install"].includes(projectName)) {
      // 没有输入项目名称，默认使用模板名称代替
      projectName = templateName
    }

    return beforeInit(projectName)
      .then(installOptions => {
        let url = templateList[templateName]

        // 提示开始
        console.log(chalk.green("开始执行..."))

        // 出现加载图标
        const spinner = ora("正在下载模板..." + templateList[templateName] + "...")
        spinner.start()

        return new Promise((subResolve, subRreject) => {
          download(`direct:${url}`, `./${projectName}`, { clone: true }, (err) => {
            if (err) {
              spinner.fail()
              console.log(chalk.red(symbols.error), chalk.red(`执行失败${err.toString()?.includes("git clone") ? "【请检查当前目录下是否已经存在同名项目】" : ""}： ${err}`))
              subRreject();
              return
            }
            // 结束加载图标
            spinner.succeed()
            console.log(chalk.green(symbols.success), chalk.green("模板下载完毕！"))
            subResolve();
          })
        })
          .then(() => {
            resolve(installOptions)
          })
          .catch(v => {
            reject(v)
          })
      })
  })
}

// 初始化之前先询问
function beforeInit(projectName) {
  const question = [
    {
      name: "command",
      type: "input",
      message: "请输入依赖安装方式【yarn or npm】，默认 " + defaultCommand,
      validate(val) {
        if (!val) {
          // 走默认 yarn
          return true
        } else if (val !== "yarn" && val !== "npm") {
          return `请在【yarn、npm】中选择一种`
        } else {
          return true
        }
      }
    }
  ]
  return inquirer.prompt(question).then((answers) => {
    let { command } = answers
    command = command || defaultCommand;
    const cwd = process.cwd();
    return {
      command,
      // 拼接需要安装依赖的路径
      cwd: path.resolve(cwd, projectName),
      projectName
    }
  })
}

initTemplate()
  .then(options => {
    console.log(chalk.green("开始下载依赖..."))
    return install(options);
  })
  .then(({projectName}) => {
    console.log(chalk.green(symbols.success), chalk.green(`执行完成，如需进入项目，执行命令：cd ${projectName}`))
  })
  .catch(error => {
    if (error) {
      console.log(chalk.red(symbols.error), chalk.red(error))
    }
  })

