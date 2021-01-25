const cli = require("./cli")
const nls = require("./nls")

const options = cli(process.argv)
nls(options)

// let file = {
//   pathName: 'string',
//   type: 'string',
//   file: 'string',
//   uid: 'stats.uid',
//   gid: 'stats.gid',
//   size: 'stats.size',
//   time: 'new Date(stats.mtimeMs)',
//   modeString: 'modeString(stats)',
//   nlink: 'stats.nlink',
//   icon: 'string',
//   ishidden: true
// }
