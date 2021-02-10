const gStatus = require('g-status');
const path = require('path')

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
    gitStatus[item.path] = item.workingTree + item.index
  })
  return gitStatus
}

module.exports = filesGitStatus
