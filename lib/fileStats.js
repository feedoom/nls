const fs = require("fs").promises
const modeString = require("fs-mode-to-string")
const getIcon = require('./icons')
const color = require('./color')
const  groups = require('./groups');

function handleDate(date) {
  let dateString = date.toString().split(' ').slice(0, 5)
  let days = parseInt(dateString[2]) < 10 ? ' ' + parseInt(dateString[2]) : parseInt(dateString[2])
  dateString = [...dateString.slice(0, 2), days, dateString[4], dateString[3]]
  return color.dateColor(dateString.join(' '))
}

function getMode(stats) {
  return color.modeColor(modeString(stats))
}

function fileSize(size) {
  let carry = 0
  let unit = ['B', 'KB', 'MB', 'GB']
  while((size + '').length > 3) {
    size = Math.round(size * 10 / 1024) / 10
    carry++
  }
  let sizeString = ''
  if((size + '').length < 3) {
    sizeString = ' '.repeat(3 - (size + '').length) + size
  } else {
    sizeString = size
  }
  return color.size(`${sizeString} ${unit[carry] === 'B' ? 'B ' : unit[carry]}`)
}

function getRealpath(path) {
  return fs.realpath(path)
}


async function fileMessages(path, argvs) {
  let stats = null

  try {
    stats = await fs.lstat(path)
  } catch (err) {
    return Promise.reject(`nls: cannot access '${path.split('/').pop()}': No such file or directory`)
  }

  let fileMessage = {
    fullPathName: path,
    pathName: path.split('/').pop()
  }

  if (stats.isDirectory()) {
    fileMessage.type = 'dir'
  } else if (stats.isSymbolicLink()) {
    fileMessage.type = 'link'
  } else {
    fileMessage.type = 'file'
  }

  // file 的具体类型
  if(fileMessage.type === 'dir') {
    fileMessage.file = 'dir'
  } else if (fileMessage.type === 'link') {
    fileMessage.file = 'link'
  } else if (fileMessage.type === 'file'){
    fileMessage.file = path.split(/[.\/]/).pop()
  } else {
    fileMessage.file = 'other'
  }

  // ishidden
  fileMessage.ishidden = fileMessage.pathName[0] === '.'

  if(argvs.list) {
    // file uid
    fileMessage.uid = stats.uid
    // file username
    fileMessage.username = groups[stats.gid]
    // file gid
    fileMessage.gid = stats.gid
    // file groupname
    fileMessage.groupname = groups[stats.gid]
    // file time
    fileMessage.time = handleDate(new Date(stats.mtimeMs))
    // file mode
    fileMessage.mode = getMode(stats)
    // file size
    fileMessage.size= fileSize(stats.size)
  }

  if(argvs.icon) {
    // file icon
    fileMessage.icon = getIcon(fileMessage.file)
  }

  if(argvs.indent) {
    // file icon
    fileMessage.indent = argvs.indent
  }

  // symlink realpath
  if(fileMessage.file === 'link') {
    let realPathName = await getRealpath(path)
    fileMessage.realpath = realPathName
  }

  return fileMessage
}

async function fileStats (paths, argvs) {
  const filesStats = []
  for(let i = 0; i < paths.length; i++) {
    try {
      let fileMessage = await fileMessages(paths[i], argvs)
      filesStats.push(fileMessage)
    } catch (err) {
      return Promise.reject(err)
    }
  }
  return filesStats
}

module.exports = fileStats

