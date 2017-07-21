#!/usr/bin/env node

const fs = require('then-fs')
const globby = require('globby')
const path = require('path')
const chalk = require('chalk')

// Reshape
const reshape = require('reshape')
const sugarml = require('sugarml')
const beautify = require('reshape-beautify')

// Postcss
const postcss = require('postcss')
const sugarss = require('sugarss')

const reshapeConfig = {
  parser: sugarml,
  plugins: [beautify()]
}

const processFiles = opts => {
  globby([`**/*.${opts.inputExt}`, '!node_modules'])
    .then(files =>
      Promise.all(
        files.map(file => {
          const newFile = path.join(
            path.dirname(file),
            path.basename(file, opts.inputExt) + opts.outputExt
          )
          return fs
            .readFile(file, 'utf-8')
            .then(opts.process)
            .then(newText => fs.writeFile(newFile, newText))
        })
      )
    )
    .then(console.log(chalk.green('Done!')))
}

processFiles({
  inputExt: 'sgr',
  outputExt: 'html',
  process: text =>
    reshape(reshapeConfig).process(text).then(res => res.output())
})

processFiles({
  inputExt: 'sss',
  outputExt: 'css',
  process: text => postcss().process(text, {parser: sugarss})
})
