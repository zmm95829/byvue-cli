const inquirer = require("inquirer")
const fs = require("fs")
const templateList = require(`${__dirname}/../template`)
const { showTable } = require(`${__dirname}/../../util/index`)
const symbols = require("log-symbols")
const chalk = require("chalk")
chalk.level = 1

// 展示所有模板信息
showTable(templateList, false)

const question = [
  {
    name: "name",
    message: "请输入要删除的模板名称",
    validate(val) {
      if (!val) {
        return "请输入要删除的模板名称！"
      } else if (!templateList[val]) {
        return `模板【${val}】不存在！`
      } else {
        return true
      }
    }
  }
]

inquirer.prompt(question).then((answers) => {
  const { name } = answers
  delete templateList[name]
  fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(templateList), "utf-8", (err) => {
    if (err) console.log(chalk.red(symbols.error), chalk.red(err))
    console.log(chalk.green(symbols.success), chalk.green("删除成功！"))
    console.log(chalk.green("更新后的模板信息如下: "))
    showTable(templateList, false)
  })
})