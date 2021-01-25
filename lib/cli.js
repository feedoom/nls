// const SORT_ARGVS = ['l', 'a', 'i']

// const LONG_ARGVS = ['list', 'all', 'icon']

// function isArgv ({ paths, argvs }) {
//   //
//   argvs.forEach(item => {})
// }

// ls: option requires an argument -- 'w'
// Try 'ls --help' for more information.



function parseArgv (options) {
  // 多个路径
  const paths = []
  // 参数
  const argvs = []

  options.slice(2).forEach(item => {
    if(item[0] === '-') {
      argvs.push(item.replace(/-/g, ''))
    } else {
      paths.push(item)
    }
  })

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
