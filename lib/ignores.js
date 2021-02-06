const ignore = require('ignore')
const parse = require('parse-gitignore');
const fs = require('fs')

/*
  根据 .gitignore 隐藏文件
  */
let isIgnores = null
try {
  let reg = parse(fs.readFileSync(process.cwd() + '/.gitignore'))
  const ig = ignore().add(reg)
  isIgnores =  function (file) {
    return ig.ignores(file)
  }
} catch {
  isIgnores =  function () {
    return false
  }
}


module.exports = isIgnores
