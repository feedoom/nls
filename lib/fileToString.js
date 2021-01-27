const color = require('./color')

function hiddenFiles(filesStats) {
  return filesStats.filter(item => !item.ishidden)
}

function addStringKey(filesStats) {
  // 给 filesStats 对象添加 string 健,用于以后输出
  for(let fileStats of filesStats) {
    fileStats.string = fileStats.pathName
  }
}


function joinString(fileStringArr) {
  // 将文件名(行 * 列)数组合成字符串数组

  // 每列最大字符串的长度,用于一列文件对齐
  let maxColumns = []
  for(let i = 0; i < fileStringArr[0].length; i++) {
    let maxColumn = 0
    for(let j = 0; j < fileStringArr.length; j++) {
      let currentStringLength = fileStringArr[j][i] ? fileStringArr[j][i].length : 0
      if(currentStringLength > maxColumn) maxColumn = currentStringLength
    }
    maxColumns.push(maxColumn)
  }
  // 字符串数组
  let joinString = []
  // 每个文件字符串后要填充的空白符
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
  return [joinString, spaceArr]
}

function isLong(fileStringArr) {
  // 一行的字符串是否超过屏幕
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
  // 将文件名数组转化为二维数组, 行 * 列
  let fileStringArr = filesStats.map(item => [item.string])
  // 一行的列数
  let count = 1
  while(!isLong(fileStringArr) && (fileStringArr.length > 1)){
    // 一行的字符串没超过屏幕且列数大于1时，添加列数
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

function noIconAndList(filesStats) {
  for(let fileStats of filesStats) {
    switch (fileStats.file) {
      case 'link':
        fileStats.string += '@'
        break
      case 'dir':
        fileStats.string += '/'
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

function fileColor(file, str) {
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
  // 处理 -l 参数
  for(let fileStats of filesStats) {
    fileStats.string = `${fileStats.mode} ${fileStats.username} ${fileStats.groupname} ${fileStats.size} ${fileStats.time} ${fileColor(fileStats.file, fileStats.string)}`
    if(fileStats.realpath) {
      // 符合链接
      fileStats.string += ' ⇒ ' + color.linkBlue(`${fileStats.realpath}`)
    }
    fileStats.string += '\n'
  }
  filesStats[filesStats.length - 1].string = filesStats[filesStats.length - 1].string.slice(0, -1)
}

function addSpace(filesStats) {
  // 文件对齐
  let spaceArr = spaceCount(filesStats)
  for(let i = 0; i < filesStats.length; i++) {
    filesStats[i].string = fileColor(filesStats[i].file, filesStats[i].string + '  ' + spaceArr[i])
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
    if(!argvs.includes('l')) {
      noIconAndList(filesStats)
    }
  }

  if(argvs.includes('l')) {
    addAllFormat(filesStats)
  } else {
    addSpace(filesStats)
  }

  return filesStats.map(item => item.string)
}

module.exports = fileToString

