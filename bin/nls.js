#!/usr/bin/env node

const cli = require("../lib/cli.js")
const colorls = require("../lib/colorls")

const options = cli(process.argv)

colorls(options)
