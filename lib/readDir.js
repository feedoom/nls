const readOneDir = require("./readOneDir")
const chalk = require('chalk')

async function readMoreDir(paths, argvs) {
  const dirLine = chalk.underline.hex('#13A10E')
  if(paths.length > 1) {
    for(let i = 0; i < paths.length; i++) {
      try {
        let str = await readOneDir(paths[i], argvs)
        console.log(`\n${dirLine(paths[i])}:`)
        console.log(str.join(''))
      } catch(err) {
        console.log(err)
      }
    }
  } else {
    try {
      let str = await readOneDir(paths[0], argvs)
      console.log(str.join(''))
    } catch(err) {
      console.log(err)
    }
  }
}

module.exports = readMoreDir
