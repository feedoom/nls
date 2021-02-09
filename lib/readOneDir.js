const fs = require("fs").promises
const fileStats = require("./fileStats")
const fileToString = require('./fileToString')
const path = require('path')
const ignores = require('./ignores')

/*
  读取一个文件夹
  */
async function readOneDir(currentPath, argvs) {
  const fullPath = path.resolve(currentPath)
  const isIgnores = ignores(fullPath)
  let files = null
  try {
    files = await fs.readdir(fullPath)
  } catch (err) {
  // 不是文件夹，可能是一个文件
    try {
      let filesStats = await fileStats([currentPath], argvs)
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
    files = files.map(item => path.join(currentPath, item))
    let filesStats = await fileStats(files, argvs, true)
    return fileToString(filesStats, argvs, isIgnores)
  }
}

module.exports = readOneDir

