#!/usr/bin/env node

const cli = require("../lib/cli.js")
const nls = require("../lib/nls")

const options = cli(process.argv)

nls(options)
