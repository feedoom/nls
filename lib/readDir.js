const readOneDir = require("./readOneDir")
const chalk = require('chalk')
const columns = require('cli-columns')
const path = require('path')

function deepClone(source = {}) {
  // 深拷贝
	if (typeof source !== 'object' || source == null) {
		return source
	}

	let result
	if (source instanceof Array) {
		result = []
	} else {
		result = {}
	}

	for (let key in source) {
		if (source.hasOwnProperty(key)) {
			result[key] = deepClone(source[key])
		}
	}

	return result
}

function printFunc (paths, argvs) {
  let print = null

  if(argvs.recurse || paths.length > 1) {
    print = async function (paths, argvs) {
      const dirLine = chalk.underline.hex('#13A10E')

      for(let i = 0; i < paths.length; i++) {
        try {
          let [currentFiles, childFiles] = await readOneDir(paths[i], argvs)
          console.log(`\n${dirLine(paths[i])}:`)
          if(currentFiles.length !== 0) {
              console.log(argvs.list ? currentFiles.join('\n') : columns(currentFiles, {sort: false}))
          }

          // 递归子目录
          if(childFiles) {
            childFiles = childFiles.map(item => {
              return path.join(paths[i], item)
            })
            print(childFiles, argvs)
          }

        } catch(err) {
          console.log('\n' + err)
        }
      }
    }
  } else if(argvs.tree) {

    print = async function (paths, argvs) {
      for(let i = 0; i < paths.length; i++) {
        try {
          let currentFiles = await readOneDir(paths[i], argvs)
          for(let j = 0; j < currentFiles.length; j++) {
            if(j === currentFiles.length - 1) {
              currentFiles[j].string = currentFiles[j].string.split('').reverse().join('').replace('├', '└').split('').reverse().join('')
            }
            console.log(currentFiles[j].string)

            // 遍历子目录
            if(currentFiles[j].type === 'dir') {
              let nextArgvs = deepClone(argvs)
              nextArgvs.indent += 1
              // if(j !== currentFiles.length - 1) {
              //   if(!nextArgvs.preIndent) {
              //     nextArgvs.preIndent = [nextArgvs.indent - 1]
              //   } else {
              //     nextArgvs.preIndent.push(nextArgvs.indent - 1)
              //   }
              // }
              await print([path.join(paths[i], currentFiles[j].pathName)], nextArgvs)
            }
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
        if(currentFiles.length !== 0) {
          console.log(argvs.list ? currentFiles.join('\n') : columns(currentFiles, {sort: false}))
        }
      } catch(err) {
        console.log(err)
      }
    }
  }
  return print
}



function readDir(paths, argvs) {
  let print = printFunc(paths, argvs)


  print(paths, argvs)

}

module.exports = readDir
