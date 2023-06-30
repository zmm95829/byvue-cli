const program = require("commander")
const download = require("download-git-repo")
const ora = require("ora")
const templateList = require(`${__dirname}/../template`)
const symbols = require("log-symbols")
const chalk = require("chalk")
chalk.level = 1

program.usage("<template-name> [project-name]")
program.parse(process.argv)

// 当没有输入参数的时候给个提示
if (program.args.length < 2) {
  console.log(chalk.red("byvue init 命令格式：byvue init <template-name> [project-name]"))
  console.log(chalk.green("请重新输入命令！其中，可用模板参考如下"))
  // 将模板信息打印一下
  require("./list")
  return
}

// 0:init 1:模板名 2:项目名
let templateName = program.args[1]
let projectName = program.args[2]

if (!templateList[templateName]) {
  // 模板不存在，红色显示提示
  console.log(chalk.red(`模板【${templateName}】不存在！`))
  return
}

if (!projectName) {
  // 没有输入项目名称，红色显示提示
  console.log(chalk.red("请输入项目名称！ "))
  console.log(chalk.red("byvue init 命令格式：byvue init <template-name> [project-name]"))
  return
}

let url = templateList[templateName]

// 提示开始
console.log(chalk.green("开始执行..."))

// 出现加载图标
const spinner = ora("正在下载中..." + templateList[templateName] + "...")
spinner.start()

download(`direct:${url}`, `./${projectName}`, { clone: true }, (err) => {
  if (err) {
    spinner.fail()
    console.log(chalk.red(symbols.error), chalk.red(`执行失败${err.toString()?.includes("git clone") ? "【请检查当前目录下是否已经存在同名项目】" : ""}： ${err}`))
    return
  }
  // 结束加载图标
  spinner.succeed()
  console.log(chalk.green(symbols.success), chalk.green("已执行完毕！"))
  console.log(`\n 如需进入项目，执行命令：cd ${projectName}`)
})
