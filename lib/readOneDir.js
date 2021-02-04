const fs = require("fs")
const fileStats = require("./fileStats")
const fileToString = require('./fileToString')
const path = require('path')
const os = require('os')


function readOneDir(filePath, argvs) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(filePath)
    fs.readdir(fullPath, async (error, files) => {
      if(error) {
        // 不是文件夹，可能是一个文件
        try {
          let filesStats = await fileStats([fullPath])
          resolve(fileToString(filesStats, argvs))
        } catch(err) {
          reject(err)
        }
      } else if(files.length === 0) {
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

