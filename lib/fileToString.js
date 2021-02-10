const color = require('./color')
// const isIgnores = require('./ignores')

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
    fileStats.string = `${isAddBgColor ? color.modeStringColor(fileStats.mode) : fileStats.mode} ${fileStats.username} ${fileStats.groupname} ${fileStats.size} ${fileStats.time} ${fileStats.string}`
    if(fileStats.realpath) {
      // 符合链接
      fileStats.string += ' ⇒ ' + color.linkBlue(`${fileStats.realpath}`)
    }
  }
}

function addColor(filesStats, isAddBgColor) {
  // 添加颜色
  for(let i = 0; i < filesStats.length; i++) {
    filesStats[i].string = fileColor(filesStats[i].file, filesStats[i].string, isAddBgColor)
  }
}

function sort(filesStats) {
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

  let dir = filesStats.filter(item => item.type === 'dir')
  other = filesStats.filter(item => item.type !== 'dir')
  filesStats = [...dir, ...other]

  let hidden = filesStats.filter(item => item.ishidden)
  other = filesStats.filter(item => !item.ishidden)
  filesStats = [...hidden, ...other]

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

/*
  给每个 fileMessage 添加生成 string 属性，用于以后输出
  */
function fileToString (filesStats, argvs, isIgnores) {
  if(argvs.tree) {
    argvs.sort = true
    argvs.recurse = false
  }

  if(argvs.git || argvs.ignore) {
    filesStats = ignore(filesStats, isIgnores)
  }

  if(argvs.dirs) {
    filesStats = dirs(filesStats)
  }

  if(argvs.sort) {
    filesStats = sort(filesStats)
  }

  if(!argvs.all) {
    filesStats = hiddenFiles(filesStats)
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

  if(argvs.indent) {
    addIndent(filesStats, argvs)
  }

  if(argvs.list) {
    addAllFormat(filesStats, argvs.fb)
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

