const fs = require("fs")
const fileStats = require("./fileStats")
const fileToString = require('./fileToString')
const path = require('path')
const os = require('os')


function readOneDir(filePath, argvs) {
  return new Promise((resolve, reject) => {
    let fullPath = ''
    if(filePath === os.homedir() + '/' || filePath === os.homedir()) {
      // 处理 ~/
      fullPath = filePath
    } else {
      fullPath = path.join(process.cwd(), filePath)
    }
    fs.readdir(fullPath, async (error, files) => {
      if(error) {
        reject(`nls: cannot access '${filePath}': No such file or directory`)
        return ;
      }
      if(files.length === 0) {
        // 空文件夹
        return ''
      } else {
        files = files.map(item => path.join(fullPath, item))
        let filesStats = await fileStats(files)
        resolve(fileToString(filesStats, argvs))
      }
    })
  })
}

module.exports = readOneDir

