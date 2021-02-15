const childp = require('child_process');
const groupMap = {};

if (process.platform === 'linux') {
  const users = childp.spawnSync("getent", ["passwd"]).stdout.toString('utf8').split('\n').slice(0, -1)
  for(let user of users) {
    let usrInfo = user.split(':')
    groupMap[usrInfo[2]] = usrInfo[0]
  }
} else {
  const gids = childp.spawnSync("id", ["-G"]).stdout.toString('utf8').split(' ');
  const gnms = childp.spawnSync("id", ["-Gn"]).stdout.toString('utf8').split(' ');
  let i = 0
  let j = 0
  let ref1 = 0
  for (i = j = 0, ref1 = gids.length; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
    groupMap[gids[i].trim()] = gnms[i].trim()
  }
}


module.exports = groupMap
