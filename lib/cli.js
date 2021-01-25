const defaultArgvs = ['a', 'i', 'l', 'all', 'icon', 'list']

function isErrorArgv(argv) {
  // error argument
  if(!defaultArgvs.includes(argv)) {
    console.error(`nls: option requires an argument -- '${argv}'\nTry 'nls --help' for more information.`)
    return true;
  }
}

function parseArgv (options) {
  // 多个路径
  const paths = []
  // 参数
  const argvs = []

  for(let option of options.slice(2)) {
    if(option[0] === '-') {
      if(isErrorArgv(option.slice(1))) return;
      argvs.push(option.replace(/-/g, '')[0])
    } else if(option.slice(0, 2) === '--') {
      if(isErrorArgv(option.slice(2))) return;
      argvs.push(option.replace(/-/g, '')[0])
    } else {
      paths.push(option)
    }
  }

  if(paths.length === 0) paths.push('./')

  return {
    paths,
    argvs
  }
}


function cli (options) {
  return parseArgv(options)
}

module.exports = cli
