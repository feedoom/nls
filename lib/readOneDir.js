const fs = require("fs")
const fileStats = require("./fileStats")
const fileToString = require('./fileToString')
const path = require('path')


function readOneDir(filePath, argvs) {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, async (error, files) => {
      if(error) reject(error)
      files = files.map(item => path.join(filePath, item))
      let filesStats = await fileStats(files)
      resolve(fileToString(filesStats, argvs))
    })
  })
}

module.exports = readOneDir

