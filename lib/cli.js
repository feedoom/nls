function parseArgv (options) {
  const defaultArgvs = ['a', 'i', 'l', 'all', 'icon', 'list']
  // 多个路径
  const paths = []
  // 参数
  const argvs = []

  for(let option of options.slice(2)) {
    if(option[0] === '-') {
      if(!defaultArgvs.includes(option.slice(1))) {
        // error argument
        console.error(`nls: option requires an argument -- '${option.slice(1)}'\nTry 'nls --help' for more information.`)
        return ;
      }
      argvs.push(option.replace(/-/g, '')[0])
    } else if(option.slice(0, 2) === '--') {
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
