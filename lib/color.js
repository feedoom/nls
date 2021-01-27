const chalk = require('chalk')

function dirBlue(str) {
  return chalk.hex('#005FD7')(str)
}

function linkBlue(str) {
  return chalk.hex('#61D6D6')(str)
}

function modeColor(str) {
  let strArr = str.split('')
  for(let i = 0; i < strArr.length; i++) {
    switch (strArr[i]) {
      case 'd':
        strArr[i] = chalk.hex('#005FD7')(strArr[i] + '')
        break;
      case 'l':
        strArr[i] = chalk.hex('#61D6D6')(strArr[i] + '')
        break;
      case '.':
        strArr[i] = chalk.hex('#13A10E')(strArr[i] + '')
        break;
      case 'r':
        strArr[i] = chalk.hex('#13A10E')(strArr[i] + '')
        break;
      case 'w':
        strArr[i] = chalk.hex('#C19C00')(strArr[i] + '')
        break;
      case 'x':
        strArr[i] = chalk.red(strArr[i] + '')
        break;
      case '-':
        strArr[i] = chalk.hex('#8A8A8A')(strArr[i] + '')
        break;
    }
  }
  return strArr.join('')
}

function dateColor(str) {
  const diff = (new Date() - new Date(str)) / 1000 / 60 / 60 / 24
  if(diff <= 1) {
    return chalk.hex('#00D700')(str)
  } else if(diff < 2) {
    return chalk.hex('#00D787')(str)
  } else {
    return chalk.hex('#00AF87')(str)
  }
}

function username(str) {
  return chalk.hex('#FFFFD7')(str)
}

function group(str) {
  return chalk.hex('#D7D7AF')(str)
}

function size(str) {
  return chalk.hex('#FFFFAF')(str)
}

function fileColor(file, str) {
  switch (file) {
    case 'js':
      return chalk.hex('#EFD81D')(str)
    default :
      return chalk.hex('#E7E8EB')(str)
  }
}

module.exports = {
  dirBlue,
  linkBlue,
  dateColor,
  username,
  group,
  size,
  modeColor,
  fileColor
}
