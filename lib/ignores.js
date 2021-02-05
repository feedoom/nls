const ignore = require('ignore')
const parse = require('parse-gitignore');
const fs = require('fs')

let reg = parse(fs.readFileSync(process.cwd() + '/.gitignore'))
const ig = ignore().add(reg)

function isIgnores (file) {
  return ig.ignores(file)
}

module.exports = isIgnores
