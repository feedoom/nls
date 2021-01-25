const color = require('./color')

function hiddenFiles(filesStats) {
  return filesStats.filter(item => !item.ishidden)
}

function addStringKey(filesStats) {
  for(let fileStats of filesStats) {
    fileStats.string = fileStats.pathName
  }
}

function noIcon(filesStats, argvs) {
  const hasList = argvs.includes('l')
  for(let fileStats of filesStats) {
    switch (fileStats.file) {
      case 'link':
        fileStats.string = color.linkBlue(fileStats.string + (hasList ? '' : '@'))
        break
      case 'dir':
        fileStats.string = color.dirBlue(fileStats.string + (hasList ? '' : '/'))
        break
      default :
        break
    }
  }
}

function addIcon(filesStats) {
  for(let fileStats of filesStats) {
    let noColorString = fileStats.icon + ' ' + fileStats.string
    switch (fileStats.file) {
      case 'link':
        fileStats.string = color.linkBlue(noColorString)
        break
      case 'dir':
        fileStats.string = color.dirBlue(noColorString)
        break
      default :
        fileStats.string = noColorString
        break
    }
  }
}

function addAllFormat(filesStats) {
  for(let fileStats of filesStats) {
    fileStats.string = `${fileStats.mode} ${fileStats.username} ${fileStats.groupname} ${fileStats.size} ${fileStats.time} ${fileStats.string}`
    if(fileStats.realpath) {
      fileStats.string += color.linkBlue(` ⇒ ${fileStats.realpath}`)
    }
    fileStats.string += '\n'
  }
  filesStats[filesStats.length - 1].string = filesStats[filesStats.length - 1].string.slice(0, -1)
}

function addSpace(filesStats) {
  for(let fileStats of filesStats) {
    fileStats.string += '  '
  }
}

function fileToString (filesStats, argvs) {

  if(!argvs.includes('a')) {
    filesStats = hiddenFiles(filesStats)
  }

  addStringKey(filesStats)

  if(argvs.includes('i')) {
    addIcon(filesStats)
  } else {
    noIcon(filesStats, argvs)
  }

  if(argvs.includes('l')) {
    addAllFormat(filesStats)
  } else {
    addSpace(filesStats)
  }

  return filesStats.map(item => item.string).join('')
}

module.exports = fileToString

