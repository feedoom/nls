function handleOptions(options) {
  let paths = []
  let argvs = {}
  let ignorePaths = []

  for(let i = 0; i < options.length; i++) {
    let option = options[i]
    if(option.slice(0, 2) === '--' || option[0] === '-') {
      let argv = option.replace(/-/g, '')
      switch (argv) {
        case 'a':
          argvs.all = true
          break
        case 'i':
          argvs.icon = true
          break
        case 'l':
          argvs.list = true
          break
        case 'fb':
          argvs.fb = true
          break
        case 's':
          argvs.sort = true
          break
        case 'g':
          argvs.git = true
          break
        case 'r':
          argvs.recurse = true
          break
        case 'd':
          argvs.dirs = true
          break
        case 't':
          argvs.tree = true
          argvs.indent = 1
          break
        case 'I':
          argvs.ignore = true
          i++
          ignorePaths.push(options[i].split('/').pop())
          break
        default:
          console.error(`nls: option requires an argument -- '${argv}'\nTry 'nls --help' for more information.`)
          return [null, null];
      }
    } else {
      paths.push(option)
    }
  }
  if(argvs.ignore && ignorePaths.length > 0) {
    argvs.ignorePaths = ignorePaths
  } else {
    argvs.ignore = false
    ignorePaths = null
  }
  return [paths, argvs]
}


function cli (options) {
  const [paths, argvs] = handleOptions(options.slice(2))

  // 错误参数
  if(!argvs) return ;

  // 如果 paths 为空，则添加当前目录
  if(paths.length === 0) paths.push('./')

  return {
    paths,
    argvs
  }
}


module.exports = cli
