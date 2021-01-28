const defaultArgvs = ['a', 'i', 'l', 'all', 'icon', 'list', 'fb']
const os = require('os')
const path = require('path')

function handleArgv(argvs) {
  return argvs.every(item => !isErrorArgv(item))
}

function isErrorArgv(argv) {
  // error argument
  if(!defaultArgvs.includes(argv)) {
    console.error(`colorls: option requires an argument -- '${argv}'\nTry 'colorls --help' for more information.`)
    return true;
  }
  return false
}

function parseArgv (options) {
  // 多个路径
  const paths = []
  // 参数
  const argvs = []

  for(let option of options.slice(2)) {
    if(option.slice(0, 2) === '--' || option[0] === '-') {
      argvs.push(option.replace(/-/g, ''))
      continue
    } else {
      paths.push(option)
      continue
    }
  }

  // 如果 paths 为空，则添加当前目录
  if(paths.length === 0) paths.push('./')

  // 处理参数是否错误
  if(!handleArgv(argvs)) return ;

  return {
    paths,
    argvs
  }
}


function cli (options) {
  return parseArgv(options)
}

module.exports = cli
