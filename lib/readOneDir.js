const fs = require("fs")
const fileStats = require("./fileStats")
const stringPrint = require('./stringPrint')


function readOneDir(path, argvs) {
  fs.readdir(path, async (error, files) => {
    if(error) throw error
    let filesStats = await fileStats(files)
    stringPrint(filesStats, argvs)
  })
}

module.exports = readOneDir

