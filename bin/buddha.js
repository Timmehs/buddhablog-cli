#!/usr/bin/env node

var program = require("commander");
var VERSION = require("../package").version;

program
  .version(VERSION, " --version")
  .command(
    "new <dir>",
    "Create a new BuddhaBlog project in given directory name (will create directory if non-existant)."
  )
  .command(
    "post [title] [tags...]",
    "Create a new blog post with today's date."
  )
  .parse(process.argv);
