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



async function printTree(currentFilesStats, paths, argvs) {
  // 打印文件数
    for(let i = 0; i < currentFilesStats.length; i++) {
      if(i === currentFilesStats.length - 1) {
        // 如果是当前目录最后的一个文件,├ 转为 └
        currentFilesStats[i].string = currentFilesStats[i].string.split('').reverse().join('').replace('├', '└').split('').reverse().join('')
      }

      console.log(currentFilesStats[i].string)

      // 遍历子目录
      if(currentFilesStats[i].type === 'dir') {
        let nextArgvs = deepClone(argvs)
        // 子目录缩进加 1
        nextArgvs.indent += 1
        if(i !== currentFilesStats.length - 1) {
          if(!nextArgvs.preIndent) {
            nextArgvs.preIndent = [nextArgvs.indent - 1]
          } else {
            nextArgvs.preIndent.push(nextArgvs.indent - 1)
          }
        }
        await printOneDir([path.join(paths[0], currentFilesStats[i].pathName)], nextArgvs)
      }
    }
}



async function printOneDir(paths, argvs) {
  try {
    let [currentFilesStats] = await readOneDir(paths[0], argvs)
    if(currentFilesStats && currentFilesStats?.length !== 0) {
      if(argvs.tree) {
        await printTree(currentFilesStats, paths, argvs)
      } else {
        let currentFiles = currentFilesStats.map(item => item.string)
        console.log(argvs.list ? currentFiles.join('\n') : columns(currentFiles, {sort: false}))
      }
    }
  } catch(err) {
    console.log(err)
  }
}



async function printMoreDir(paths, argvs) {
  const dirLine = chalk.underline.hex('#13A10E')

  for(let i = 0; i < paths.length; i++) {
    try {
      let [currentFilesStats, childFiles] = await readOneDir(paths[i], argvs)
      if(currentFilesStats && currentFilesStats?.length !== 0) {
        console.log(`\n${dirLine(paths[i])}:`)
        if(argvs.tree) {
          // -t 文件树
          await printTree(currentFilesStats, [paths[i]], argvs)
        } else {
          let currentFiles = currentFilesStats.map(item => item.string)
          console.log(argvs.list ? currentFiles.join('\n') : columns(currentFiles, {sort: false}))
        }
      }

      // -r 参数递归子目录
      if(argvs.recurse && childFiles) {
        childFiles = childFiles.map(item => {
          return path.join(paths[i], item)
        })
        printMoreDir(childFiles, argvs)
      }

    } catch(err) {
      console.log('\n' + err)
    }
  }
}



function readDir(paths, argvs) {
  let print = null

  if(argvs.recurse || paths.length > 1) {
    print = printMoreDir
  } else {
    print = printOneDir
  }

  print(paths, argvs)

}

module.exports = readDir
