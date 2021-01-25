#!/usr/bin/env node

const cli = require("../lib/cli.js")
const nls = require("../lib/nls.js")

const options = cli(process.argv, process.cwd())

nls(options)
