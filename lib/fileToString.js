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

function fileToString (filesStats, argvs) {
  if(argvs.includes('s')) {
    filesStats = sort(filesStats)
  }

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

  const isAddBgColor = argvs.includes('f')
  if(argvs.includes('l')) {
    addAllFormat(filesStats, isAddBgColor)
  } else {
    addSpace(filesStats, isAddBgColor)
  }

  return filesStats.map(item => item.string)
}

module.exports = fileToString

