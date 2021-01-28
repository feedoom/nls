const chalk = require('chalk')

function dirBlue(str, isAddBgColor) {
  if(isAddBgColor) {
    return chalk.bgHex('#000087').white(' ' + str + ' ')
  } else {
    return chalk.hex('#005FD7')(str)
  }
}

function linkBlue(str) {
  return chalk.hex('#61D6D6')(str)
}

function modeStringColor(str) {
  return chalk.bgHex('#121212')(' ' + str + ' ')
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
    case 'html':
      return chalk.hex('#E44D26')(str)
    case 'css':
      return chalk.hex('#EF0F63')(str)
    case 'scss':
      return chalk.hex('#EF0F63')(str)
    case 'sass':
      return chalk.hex('#EF0F63')(str)
    case 'less':
      return chalk.hex('#EF0F63')(str)
    case 'js':
      return chalk.hex('#EFD81D')(str)
    case 'ts':
      return chalk.hex('#2F74C0')(str)
    case 'jsx':
      return chalk.hex('#61DAFB')(str)
    case 'tsx':
      return chalk.hex('#61DAFB')(str)
    case 'vue':
      return chalk.hex('#41B883')(str)
    case 'php':
      return chalk.hex('#7377AD')(str)
    case 'py':
      return chalk.hex('#366B99')(str)
    case 'go':
      return chalk.hex('#529BBA')(str)
    case 'java':
      return chalk.hex('#FF1515')(str)
    case 'c':
      return chalk.hex('#5968BA')(str)
    case 'cpp':
      return chalk.hex('#3747A6')(str)
    case 'sh':
      return chalk.hex('#AA759F')(str)
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
  fileColor,
  modeStringColor
}
