function noArgv(filesStats) {
}

function stringPrint (filesStats, argvs) {
  for(let fileStats of filesStats) {
    let str = ''
    str += `${fileStats.mode} ${fileStats.username} ${fileStats.groupname} ${fileStats.size} ${fileStats.time} ${fileStats.icon} ${fileStats.pathName}`
    if(fileStats.realpath) {
      str += ` ⇒ fileStats.realpath`
    }
    console.log(str)
  }
}

module.exports = stringPrint

