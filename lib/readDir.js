const readOneDir = require("./readOneDir")
const chalk = require('chalk')
const columns = require('cli-columns')

async function readMoreDir(paths, argvs) {
  const dirLine = chalk.underline.hex('#13A10E')
  if(paths.length > 1) {
    for(let i = 0; i < paths.length; i++) {
      try {
        let str = await readOneDir(paths[i], argvs)
        console.log(`\n${dirLine(paths[i])}:`)
        if(str.length !== 0) console.log(columns(str, {sort: false}))
      } catch(err) {
        console.log('\n' + err)
      }
    }
  } else {
    try {
      let str = await readOneDir(paths[0], argvs)
      if(str.length !== 0) console.log(columns(str, {sort: false}))
    } catch(err) {
      console.log(err)
    }
  }
}

module.exports = readMoreDir
