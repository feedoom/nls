const fs = require("fs")
const getIcon = require('./icons')
const color = require('./color')

function handleDate(date) {
  let dateString = date.toString().split(' ').slice(0, 5)
  let days = parseInt(dateString[2]) < 10 ? ' ' + parseInt(dateString[2]) : parseInt(dateString[2])
  dateString = [...dateString.slice(0, 2), days, dateString[4], dateString[3]]
  return color.dateColor(dateString.join(' '))
}

function getMode(stats) {
  const modeString = require("fs-mode-to-string")
  return color.modeColor(modeString(stats))
}

function getUsername(uid) {
  const userid = require('userid');
  return color.username(userid.username(uid))
}

function getGroupName(gid) {
  const userid = require('userid');
  return color.group(userid.groupname(gid))
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
  return new Promise((resolve, reject) => {
    fs.realpath(path, (err, path) => {
      if(err) reject(err)
      resolve(path)
    })
  })
}

function fileMessages(path) {
  return new Promise((resolve, reject) => {
    // file path
    let fileMessage = {
      fullPathName: path,
      pathName: path.split('/').pop()
    }
    fs.lstat(path, async (err, stats) => {
      if(err) reject(err)
      // file type
      if (stats.isFile()) {
        fileMessage.type = 'file'
      } else if (stats.isDirectory()) {
        fileMessage.type = 'dir'
      } else if (stats.isSymbolicLink()) {
        fileMessage.type = 'link'
      } else {
        fileMessage.type = 'other'
      }
      // file file
      if(fileMessage.type === 'dir') {
        fileMessage.file = 'dir'
      } else if (fileMessage.type === 'link') {
        fileMessage.file = 'link'
      } else if (fileMessage.type === 'file'){
        fileMessage.file = path.split(/[.\/]/).pop()
      } else {
        fileMessage.file = 'other'
      }
      // file uid
      fileMessage.uid = stats.uid
      // file username
      fileMessage.username = getUsername(stats.uid)
      // file gid
      fileMessage.gid = stats.gid
      // file groupname
      fileMessage.groupname = getGroupName(stats.gid)
      // file time
      fileMessage.time = handleDate(new Date(stats.mtimeMs))
      // file mode
      fileMessage.mode = getMode(stats)
      // ishidden
      fileMessage.ishidden = fileMessage.pathName[0] === '.'
      // file icon
      fileMessage.icon = getIcon(fileMessage.file)
      // file size
      fileMessage.size= fileSize(stats.size)
      // symlink realpath
      if(fileMessage.file === 'link') {
        let realPathName = await getRealpath(path)
        fileMessage.realpath = realPathName
      }

      resolve(fileMessage)
    })
  })
}

async function fileStats (paths) {
  const filesStats = []
  for(let i = 0; i < paths.length; i++) {
    let fileMessage = await fileMessages(paths[i])
    filesStats.push(fileMessage)
  }
  return filesStats
}

module.exports = fileStats

