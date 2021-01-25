const readDir = require('./readDir')

function nls (options) {
  if(!options) return ;
  const { paths, argvs } = options
  readDir(paths, argvs)
}

module.exports = nls
