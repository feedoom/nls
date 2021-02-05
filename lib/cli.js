function handleArgv(argvs) {
  const argvsObj = {}
  for(let argv of argvs) {
    switch (argv) {
      case 'a':
        argvsObj.all = true
        break
      case 'i':
        argvsObj.icon = true
        break
      case 'l':
        argvsObj.list = true
        break
      case 'fb':
        argvsObj.fb = true
        break
      case 's':
        argvsObj.sort = true
        break
      case 'g':
        argvsObj.git = true
        break
      default:
        console.error(`nls: option requires an argument -- '${argv}'\nTry 'nls --help' for more information.`)
        return ;
    }
  }
  return argvsObj
}

function cli (options) {
  // 多个路径
  const paths = []
  // 参数
  let argvs = []

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

  // 处理参数
  argvs = handleArgv(argvs)
  if(!argvs) return ;

  return {
    paths,
    argvs
  }
}


module.exports = cli
