const readOneDir = require("./readOneDir")
const chalk = require('chalk')
const columns = require('cli-columns')
const path = require('path')
const fs = require('fs/promises')
const fileStats = require('./fileStats')
const fileToString = require('./fileToString')
const ignores = require('./ignores')
const filesGitStatus = require('./filesGitStatus')

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



async function printTree(currentFilesStats, paths, argvs, gitStatus) {
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
        await printOneDir([path.join(paths[0], currentFilesStats[i].pathName)], nextArgvs, gitStatus)
      }
    }
}



async function printOneDir(paths, argvs, gitStatus) {
  try {

    if(argvs.gitStatus && !gitStatus) {
      gitStatus = await filesGitStatus(paths[0])
    }

    let [currentFilesStats] = await readOneDir(paths[0], argvs, gitStatus)
    if(currentFilesStats && currentFilesStats?.length !== 0) {
      if(argvs.tree) {
        await printTree(currentFilesStats, paths, argvs, gitStatus)
      } else {
        let currentFiles = currentFilesStats.map(item => item.string)
        console.log(argvs.list ? currentFiles.join('\n') : columns(currentFiles, {sort: false}))
      }
    }
  } catch(err) {
    console.log(err)
  }
}



async function printMoreDir(paths, argvs, gitStatus) {
  const dirLine = chalk.underline.hex('#13A10E')

  for(let i = 0; i < paths.length; i++) {
    try {

    if(argvs.gitStatus) {
      if(!argvs.recurse) {
        // 不递归
        gitStatus = await filesGitStatus(paths[i])
      } else {
        // -r 递归
        if(!gitStatus) {
          gitStatus = await filesGitStatus(paths[i])
        }
      }
    }

      let [currentFilesStats, childFiles] = await readOneDir(paths[i], argvs, gitStatus)
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
        printMoreDir(childFiles, argvs, gitStatus)
      }

    } catch(err) {
      console.log('\n' + err)
    }
  }
}



async function printFiles(paths, argvs) {
  const newArgvs = deepClone(argvs)
  newArgvs.recurse = false
  newArgvs.all = false
  newArgvs.git = false
  newArgvs.dirs = false
  newArgvs.tree = false
  newArgvs.indent = false
  newArgvs.gitStatus = false

  let isIgnores = null
  if(newArgvs.ignore) {
    // 忽略文件
    isIgnores = ignores('', newArgvs)
  }

  const filesStats = await fileStats(paths, newArgvs, false)
  let [files] = fileToString(filesStats, newArgvs, isIgnores)
  if(files && files.length > 0) {
    files = files.map(item => item.string)
    console.log(newArgvs.list ? files.join('\n') : columns(files, {sort: false}))
  }
}



async function fileOrDir(pathName) {
  let stats = null
  try {
    let fullPath = path.resolve(pathName)
    let realPath = await fs.realpath(fullPath)
    stats = await fs.lstat(realPath)
  } catch {
    console.log(`nls: cannot access '${pathName}': No such file or directory`)
    return 'error'
  }

  if(stats.isDirectory()) {
    return 'dir'
  } else if(stats.isFile()) {
    return 'file'
  }
}


async function readDir(paths, argvs) {
  let files = []
  let dirs = []

  for(let pathName of paths) {
    let type = await fileOrDir(pathName)
    switch (type) {
      case 'dir':
        dirs.push(pathName)
        break
      case 'file':
        files.push(pathName)
        break
      default:
        break
    }
  }


  if(files.length > 0) {
    await printFiles(files, argvs)
  }


  if(dirs.length > 0) {
    if(argvs.recurse || paths.length > 1) {
      await printMoreDir(dirs, argvs)
    } else {
      await printOneDir(dirs, argvs)
    }
  }


}

module.exports = readDir
