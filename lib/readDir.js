const readOneDir = require("./readOneDir")

async function readMoreDir(paths, argvs) {
  if(paths.length > 1) {
    for(let i = 0; i < paths.length; i++) {
      let current = paths[i].split('/').slice(-2).shift() + ''
      try {
        let str = await readOneDir(paths[i], argvs)
        console.log(`\n${current}:`)
        console.log(str.join(''))
      } catch(err) {
        console.log(err)
      }
    }
  } else {
    let str = await readOneDir(paths[0], argvs)
    console.log(str.join(''))
  }
}

module.exports = readMoreDir
