function hiddenFiles(filesStats) {
  return filesStats.filter(item => !item.ishidden)
}

function addStringKey(filesStats) {
  for(let fileStats of filesStats) {
    fileStats.string = fileStats.pathName
  }
}

function noIcon(filesStats) {
  for(let fileStats of filesStats) {
    switch (fileStats.type) {
      case 'link':
        fileStats.string += '@'
        break
      case 'dir':
        fileStats.string += '/'
        break
    }
  }
}

function addIcon(filesStats) {
  for(let fileStats of filesStats) {
    fileStats.string = fileStats.icon + ' ' + fileStats.string
  }
}

function addAllFormat(filesStats) {
  for(let fileStats of filesStats) {
    fileStats.string = `${fileStats.mode} ${fileStats.username} ${fileStats.groupname} ${fileStats.size} ${fileStats.time} ${fileStats.string}`
    if(fileStats.realpath) {
      fileStats.string += ` ⇒ ${fileStats.realpath}`
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
    noIcon(filesStats)
  }

  if(argvs.includes('l')) {
    addAllFormat(filesStats)
  } else {
    addSpace(filesStats)
  }

  return filesStats.map(item => item.string).join('')
}

module.exports = fileToString

