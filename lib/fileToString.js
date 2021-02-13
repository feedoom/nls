const color = require('./color')
const path = require('path')

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

function handleDate(date) {
  let dateString = date.toString().split(' ').slice(0, 5)
  let days = parseInt(dateString[2]) < 10 ? ' ' + parseInt(dateString[2]) : parseInt(dateString[2])
  dateString = [...dateString.slice(0, 2), days, dateString[4], dateString[3]]
  return color.dateColor(dateString.join(' '))
}

function addAllFormat(filesStats, isAddBgColor, isIcon) {
  // 处理 -l 参数
  for(let fileStats of filesStats) {
    let modeColorString = color.modeColor(fileStats.mode, fileStats.type)
    fileStats.string = `${isAddBgColor ? color.modeStringAddBg(modeColorString) : modeColorString} ${fileStats.username} ${fileStats.groupname} ${fileStats.size} ${handleDate(new Date(fileStats.time))} ${fileStats.string}`
    if(fileStats.realpath) {
      // 符合链接
      fileStats.string += ` ${isIcon ? '⇒' : '=>'} ` + color.linkBlue(`${fileStats.realpath}`)
    }
  }
}

function addColor(filesStats, isAddBgColor) {
  // 添加颜色
  for(let i = 0; i < filesStats.length; i++) {
    filesStats[i].string = fileColor(filesStats[i].file, filesStats[i].string, isAddBgColor)
  }
}

function sort(filesStats, isAll, isDirs) {
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

  if(!isDirs) {
    let link = filesStats.filter(item => item.type === 'link')
    let other = filesStats.filter(item => item.type !== 'link')
    filesStats = [...link, ...other]
  }

  let dir = filesStats.filter(item => item.type === 'dir')
  other = filesStats.filter(item => item.type !== 'dir')
  filesStats = [...dir, ...other]

  if(isAll) {
    let hidden = filesStats.filter(item => item.ishidden)
    other = filesStats.filter(item => !item.ishidden)
    filesStats = [...hidden, ...other]
  }

  return filesStats
}

function ignore(filesStats, isIgnores) {
  return filesStats.filter(item => {
    let pathName = item.pathName.split('/').pop()
    return !isIgnores(pathName)
  })
}

function dirs(filesStats) {
  return filesStats.filter(item => item.type === 'dir')
}

function addIndent(filesStats, argvs) {
  for(let fileStats of filesStats) {
    let currentStr = '├' + ''.padStart(2, '─') + ' ' + fileStats.string
    if(argvs.preIndent) {
      let preIndent = argvs.preIndent
      let preStr = ''
      for(let i = 0; i < preIndent.length; i++) {
        let isAddSpace = preIndent[i] - (preIndent[i - 1] || 0) !== 1
        if(isAddSpace) {
          preStr += ''.padStart((preIndent[i] - (preIndent[i - 1] || 0) - 1) * 3)
        }
        preStr += '│' + ''.padStart(2)
        if(i === preIndent.length - 1 && fileStats.indent - preIndent[i] !== 1) {
          preStr += ''.padStart((fileStats.indent - preIndent[i] - 1) * 3)
        }
        fileStats.string = preStr + currentStr
      }
    } else {
      fileStats.string = ''.padStart((argvs.indent - 1) * 2) + currentStr
    }
  }
}


function gitStatusFilter(filesStats, gitStatus, isIcon) {
  for(let fileStats of filesStats) {
    let fileFullPathName = fileStats.fullPathName
    if(!gitStatus[fileFullPathName]) {
      fileStats.string += gitStatus.isIgnores(fileFullPathName.split('/').pop()) ? ' •' : ''
    } else {
      fileStats.string += ' ' + color.gitStatusIcon(gitStatus[fileFullPathName][0], isIcon)
    }
  }
}

function execute(filesStats) {
  return filesStats.filter(item => item.mode[3] === 'x')
}

function time(filesStats) {
  filesStats.sort((s1, s2) => s2.time - s1.time)
}


/*
  给每个 fileMessage 添加生成 string 属性，用于以后输出
  */
function fileToString (filesStats, argvs, isIgnores, gitStatus) {
  if(argvs.tree) {
    argvs.sort = true
    argvs.recurse = false
  }

  if(argvs.execute) {
    filesStats = execute(filesStats)
  }

  if(argvs.dirs) {
    filesStats = dirs(filesStats)
  }

  if(argvs.git || argvs.ignore) {
    filesStats = ignore(filesStats, isIgnores)
  }

  if(!argvs.all) {
    filesStats = hiddenFiles(filesStats)
  }

  if(argvs.time) {
    time(filesStats)
  }

  if(argvs.sort) {
    filesStats = sort(filesStats, argvs.all, argvs.dirs)
  }

  addStringKey(filesStats)

  if(argvs.icon) {
    addIcon(filesStats)
  } else {
    if(!argvs.list) {
      noIconAndList(filesStats)
    }
  }

  addColor(filesStats, argvs.fb)

  if(argvs.gitStatus) {
    gitStatusFilter(filesStats, gitStatus, argvs.icon)
  }

  if(argvs.indent) {
    addIndent(filesStats, argvs)
  }

  if(argvs.list) {
    addAllFormat(filesStats, argvs.fb, argvs.icon)
  }

  if(argvs.indent){
    return [filesStats, null]
  }

  let childFolders = null
  if(argvs.recurse) {
    childFolders = (filesStats.reduce((sum, current) => {
      if(current.type === 'dir') {
          sum.push(current.pathName)
      }
      return sum
    }, []))
  }

  return [filesStats, childFolders]
}

module.exports = fileToString

