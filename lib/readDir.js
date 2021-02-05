const readOneDir = require("./readOneDir")
const chalk = require('chalk')
const columns = require('cli-columns')
const path = require('path')

function readDir(paths, argvs) {
  const dirLine = chalk.underline.hex('#13A10E')
  let print = null

  if(argvs.recurse || paths.length > 1) {
    print = async function (paths, argvs) {
      for(let i = 0; i < paths.length; i++) {
        try {
          let [currentFiles, childFiles] = await readOneDir(paths[i], argvs)
          console.log(`\n${dirLine(paths[i])}:`)
          if(currentFiles.length !== 0) console.log(columns(currentFiles, {sort: false}))

          // 递归子目录
          if(childFiles) {
            childFiles = childFiles.map(item => {
              return path.join(paths[i], item)
            })
            readDir(childFiles, argvs)
          }

        } catch(err) {
          console.log('\n' + err)
        }
      }
    }
  } else {
    print = async function (paths, argvs) {
      try {
        let [currentFiles] = await readOneDir(paths[0], argvs)
        if(currentFiles.length !== 0) console.log(columns(currentFiles, {sort: false}))
      } catch(err) {
        console.log(err)
      }
    }
  }

  print(paths, argvs)

}

module.exports = readDir
