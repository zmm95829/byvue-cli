const Table = require('cli-table')

const table = new Table({
  head: ['name', 'url'],
  style: {
    head: ['green']
  }
})

function showTable (tempList, needExit = true) {
  // 需要将表格清空，不然会无限添加
  table.length = 0
  const list = Object.keys(tempList)
  if (list.length > 0) {
    list.forEach((key) => {
      table.push([key, tempList[key]])
      if (table.length === list.length) {
        console.log(table.toString())
        needExit && process.exit()
      }
    })
  } else {
    console.log(table.toString())
    needExit && process.exit()
  }
}

exports.showTable = showTable