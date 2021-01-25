const readOneDir = require("./readOneDir")
const readMoreDir = require('./readMoreDir')

function nls (options) {
  if(!options) return ;
  const { paths, argvs } = options
  if (paths.length === 1) {
    readOneDir(paths[0], argvs)
  } else {
    readMoreDir(paths, argvs)
  }
}

module.exports = nls
