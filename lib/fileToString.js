const color = require('./color')

function hiddenFiles(filesStats) {
  return filesStats.filter(item => !item.ishidden)
}

function addStringKey(filesStats) {
  for(let fileStats of filesStats) {
    fileStats.string = fileStats.pathName
  }
}


function joinString(fileStringArr) {
  let maxColumns = []
  for(let i = 0; i < fileStringArr[0].length; i++) {
    let maxColumn = 0
    for(let j = 0; j < fileStringArr.length; j++) {
      let currentStringLength = fileStringArr[j][i] ? fileStringArr[j][i].length : 0
      if(currentStringLength > maxColumn) maxColumn = currentStringLength
    }
    maxColumns.push(maxColumn)
  }
  let joinString = []
  let spaceArr = []
  fileStringArr.forEach(currentRowFiles => {
    let str = ''
    for(let i = 0; i < currentRowFiles.length; i++) {
      let tmp = currentRowFiles[i].padEnd(maxColumns[i], ' ')
      str += tmp
      spaceArr.push(' '.repeat(tmp.length - currentRowFiles[i].length))
    }
    joinString.push(str + '\n')
    spaceArr[spaceArr.length - 1] = spaceArr[spaceArr.length - 1] + '\n'
  })
  spaceArr[spaceArr.length - 1] = spaceArr[spaceArr.length - 1].slice(0, -1)
  return [joinString,spaceArr]
}

function isLong(fileStringArr) {
  const terminalCol = Math.floor((process.stdout.columns / 3) * 2)
  let joinfilestring = joinString(fileStringArr)[0]
  for(let str of joinfilestring) {
    if(str.length > terminalCol) {
      return true
    }
  }
  return false
}

function spaceCount(filesStats) {
  let fileStringArr = filesStats.map(item => [item.string])
  let count = 1
  while(!isLong(fileStringArr) && (fileStringArr.length > 1)){
    count++
    let arr = [].concat(...fileStringArr)
    fileStringArr = [[]]
    while(arr.length) {
      if(fileStringArr[fileStringArr.length - 1].length >= count) {
        fileStringArr.push([])
      } else {
        fileStringArr[fileStringArr.length - 1].push(arr.shift())
      }
    }
  }
  return joinString(fileStringArr)[1]
}

function noIcon(filesStats, argvs) {
  const hasList = argvs.includes('l')
  for(let fileStats of filesStats) {
    switch (fileStats.file) {
      case 'link':
        fileStats.string = fileStats.string + (hasList ? '' : '@')
        break
      case 'dir':
        fileStats.string = fileStats.string + (hasList ? '' : '/')
        break
      default :
        break
    }
  }
}

function addIcon(filesStats) {
  for(let fileStats of filesStats) {
    fileStats.string = fileStats.icon + ' ' + fileStats.string
  }
}

function fileColorOfList(file, str) {
    switch (file) {
      case 'link':
        return color.linkBlue(str)
      case 'dir':
        return color.dirBlue(str)
      default :
        return color.fileColor(str)
    }
}

function addAllFormat(filesStats) {
  for(let fileStats of filesStats) {
    fileStats.string = `${fileStats.mode} ${fileStats.username} ${fileStats.groupname} ${fileStats.size} ${fileStats.time} ${fileColorOfList(fileStats.file, fileStats.string)}`
    if(fileStats.realpath) {
      fileStats.string += ' ⇒ ' + color.linkBlue(`${fileStats.realpath}`)
    }
    fileStats.string += '\n'
  }
  filesStats[filesStats.length - 1].string = filesStats[filesStats.length - 1].string.slice(0, -1)
}

function addSpace(filesStats) {
  let spaceArr = spaceCount(filesStats)
  for(let i = 0; i < filesStats.length; i++) {
    filesStats[i].string = fileColorOfList(filesStats[i].file, filesStats[i].string + '  ' + spaceArr[i])
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

  return filesStats.map(item => item.string)
}

module.exports = fileToString

