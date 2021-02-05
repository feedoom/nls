const color = require('./color')
const isIgnores = require('./ignores')

function hiddenFiles(filesStats) {
  return filesStats.filter(item => !item.ishidden)
}

function addStringKey(filesStats) {
  // 给 filesStats 对象添加 string 健,用于以后输出
  for(let fileStats of filesStats) {
    fileStats.string = fileStats.pathName
  }
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

function fileColor(file, str, isAddBgColor) {
    switch (file) {
      case 'link':
        return color.linkBlue(str)
      case 'dir':
        return color.dirBlue(str, isAddBgColor)
      default :
        return color.fileColor(file, str)
    }
}

function addAllFormat(filesStats, isAddBgColor) {
  // 处理 -l 参数
  for(let fileStats of filesStats) {
    fileStats.string = `${isAddBgColor ? color.modeStringColor(fileStats.mode) : fileStats.mode} ${fileStats.username} ${fileStats.groupname} ${fileStats.size} ${fileStats.time} ${fileColor(fileStats.file, fileStats.string, isAddBgColor)}`
    if(fileStats.realpath) {
      // 符合链接
      fileStats.string += ' ⇒ ' + color.linkBlue(`${fileStats.realpath}`)
    }
  }
}

function addSpace(filesStats, isAddBgColor) {
  for(let i = 0; i < filesStats.length; i++) {
    filesStats[i].string = fileColor(filesStats[i].file, filesStats[i].string, isAddBgColor)
  }
}

function sort(filesStats, isHasG) {
  filesStats.sort(function (s1, s2) {
    x1 = s1.file
    x2 = s2.file
    if (x1 < x2) {
        return -1;
    }
    if (x1 > x2) {
        return 1;
    }
    return 0;
  });

  let link = filesStats.filter(item => item.type === 'link')
  let other = filesStats.filter(item => item.type !== 'link')
  filesStats = [...link, ...other]

  let dir = filesStats.filter(item => {
    const isDir = item.type === 'dir'
    if(!isHasG) {
      return isDir
    } else {
      return isDir && !isIgnores(isDir ? item.pathName + '/' : item.pathName)
    }
  })
  other = filesStats.filter(item => {
    const isFile = item.type !== 'dir'
    if(!isHasG) {
      return isFile
    } else {
      return isFile && !isIgnores(isFile ? item.pathName : item.pathName + '/')
    }
  })
  filesStats = [...dir, ...other]

  let hidden = filesStats.filter(item => item.ishidden)
  other = filesStats.filter(item => !item.ishidden)
  filesStats = [...hidden, ...other]

  return filesStats
}

function fileToString (filesStats, argvs) {
  const isHasS = argvs.includes('s')
  const isHasG = argvs.includes('g')
  const isHasA = argvs.includes('a')
  const isHasi = argvs.includes('i')
  const isHasl = argvs.includes('l')
  const isAddBgColor = argvs.includes('f')

  if(isHasS) {
    filesStats = sort(filesStats, isHasG)
  }

  if(!isHasA) {
    filesStats = hiddenFiles(filesStats)
  }

  addStringKey(filesStats)

  if(isHasi) {
    addIcon(filesStats)
  } else {
    if(!isHasl) {
      noIconAndList(filesStats)
    }
  }

  if(isHasl) {
    addAllFormat(filesStats, isAddBgColor)
  } else {
    addSpace(filesStats, isAddBgColor)
  }

  return filesStats.map(item => item.string)
}

module.exports = fileToString

