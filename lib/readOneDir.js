const fs = require("fs").promises
const fileStats = require("./fileStats")
const fileToString = require('./fileToString')
const path = require('path')
const ignores = require('./ignores')

/*
  读取一个文件夹
  */
async function readOneDir(filePath, argvs) {
  const fullPath = path.resolve(filePath)
  const isIgnores = ignores(fullPath)
  let files = null
  try {
    files = await fs.readdir(fullPath)
  } catch (err) {
  // 不是文件夹，可能是一个文件
    try {
      let filesStats = await fileStats([fullPath], argvs)
      return fileToString(filesStats, argvs, isIgnores)
    } catch(err) {
      // 不存在的文件
      return Promise.reject(err)
    }
  }
  if(files.length === 0) {
    // 空文件夹
    return []
  } else {
    files = files.map(item => path.join(fullPath, item))
    let filesStats = await fileStats(files, argvs)
    return fileToString(filesStats, argvs, isIgnores)
  }
}

module.exports = readOneDir

