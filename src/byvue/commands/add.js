const inquirer = require("inquirer")
const fs = require("fs")
const templateList = require(`${__dirname}/../template`)
const { showTable } = require(`${__dirname}/../../util/index`)
const symbols = require("log-symbols")
const chalk = require("chalk")
chalk.level = 1
const question = [
  {
    name: "name",
    type: "input",
    message: "请输入模板名称",
    validate(val) {
      if (!val) {
        return "请输入模板名称!"
      } else if (templateList[val]) {
        return `该模板已经存在！【${val} => ${templateList[val]}]`
      } else {
        return true
      }
    }
  },
  {
    name: "url",
    type: "input",
    message: "请输入模板地址",
    validate(val) {
      if (!val) {
        return "请输入模板地址"
      } else {
        for(let key in templateList) {
          if (templateList[key] === val) {
            return `该模板已经存在！【${key} => ${templateList[key]}]`
          }
        }
        return true
      }
    }
  }
]
inquirer.prompt(question).then((answers) => {
  let { name, url } = answers
  templateList[name] = url.replace(/[\u0000-\u0019]/g, "") // 过滤 unicode 字符
  fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(templateList), "utf-8", (err) => {
    if (err) console.log(chalk.red(symbols.error), chalk.red(err))
    console.log(chalk.green(symbols.success), chalk.green("添加成功!"))
    console.log(chalk.green("最新模板信息如下: "))
    showTable(templateList)
  })
})