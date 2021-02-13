const gStatus = require('g-status');
const path = require('path')
const ignore = require('ignore')
const parse = require('parse-gitignore');
const fs = require('fs')

async function filesGitStatus(fullPath) {
  let gitStatus = {}
  let tmp = null
  try {
    tmp = await gStatus({ cwd: fullPath })
  } catch {
    return Promise.reject(`${fullPath} not a git repository.`)
  }
  tmp.forEach(item => {
    if(item.index === 'R') {
      item.path = item.path.split(' -> ').pop()
    }
    item.path = path.resolve(path.join(fullPath, item.path))
  })
  tmp.forEach(item => {
    gitStatus[item.path] = (item.workingTree + item.index).trim()
  })

  let gitignore = parse(fs.readFileSync(path.join(fullPath, '.gitignore')))
  if(gitignore.length > 0) {
    const ig = ignore().add(gitignore)
    gitStatus.isIgnores =  function (file) {
      return ig.ignores(file)
    }
  } else {
    gitStatus.isIgnores =  function () {
      return false
    }
  }

  return gitStatus
}

module.exports = filesGitStatus
