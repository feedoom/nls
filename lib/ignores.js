const ignore = require('ignore')
const parse = require('parse-gitignore');
const fs = require('fs')
const path = require('path')

/*
  根据 .gitignore 隐藏文件
  */
function ignores(pathName) {
  let isIgnores = null
  try {
    let reg = parse(fs.readFileSync(path.join(pathName, '.gitignore')))
    const ig = ignore().add(reg)
    isIgnores =  function (file) {
      return ig.ignores(file)
    }
  } catch {
    isIgnores =  function () {
      return false
    }
  }
  return isIgnores
}


module.exports = ignores
