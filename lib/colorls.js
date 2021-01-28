const readDir = require('./readDir')

function colorls (options) {
  if(!options) return ;
  const { paths, argvs } = options
  readDir(paths, argvs)
}

module.exports = colorls
