const ignore = require('ignore')
const parse = require('parse-gitignore');
const fs = require('fs')
const path = require('path')

/*
  根据 .gitignore 隐藏文件
  */
function ignores(pathName, argvs) {
  let isIgnores = null
  let igArr = []

  if(argvs.ignore){
    igArr = igArr.concat(argvs.ignorePaths)
  }

  if(argvs.git) {
    try {
      let gitignore = parse(fs.readFileSync(path.join(pathName, '.gitignore')))
      igArr = igArr.concat(gitignore)
    } catch {
      igArr = igArr.concat([])
    }
  }

  if(igArr.length > 0) {
    const ig = ignore().add(igArr)
    isIgnores =  function (file) {
      return ig.ignores(file)
    }
  } else {
    isIgnores =  function () {
      return false
    }
  }

  return isIgnores
}


module.exports = ignores
