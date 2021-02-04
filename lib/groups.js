const childp = require('child_process');
const gids = childp.spawnSync("id", ["-G"]).stdout.toString('utf8').split(' ');
const gnms = childp.spawnSync("id", ["-Gn"]).stdout.toString('utf8').split(' ');
const groupMap = {};
let i = 0
let j = 0
let ref1 = 0
for (i = j = 0, ref1 = gids.length; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
  groupMap[gids[i].trim()] = gnms[i].trim()
}

module.exports = groupMap
