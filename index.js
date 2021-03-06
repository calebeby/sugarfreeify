#!/usr/bin/env node
const meow = require('meow')
const chalk = require('chalk')
const sugarfreeify = require('sugarfreeify-core')

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

const cli = meow(`
  Usage
    $ sugarfreeify [inputextension] <processor> [outputextension]

  <processor> is one of:
    - sugarml
    - sugarss

  [inputextension] defaults to sgr for sugarml and sss for sugarss
  [outputextension] defaults to html for sugarml and css for sugarss

  Examples
    $ sugarfreeify sugarml
`)

const processors = {
  sugarml: {
    inputExt: 'sgr',
    outputExt: 'html',
    transform: text =>
      reshape(reshapeConfig).process(text).then(res => res.output())
  },
  sugarss: {
    inputExt: 'sss',
    outputExt: 'css',
    transform: text => postcss().process(text, {parser: sugarss})
  }
}

const run = (input, flags) => {
  let transform, inputExt, outputExt

  input.forEach((keyword, i) => {
    if (processors[keyword] !== undefined) {
      transform = keyword
    } else if (i === 0) {
      inputExt = keyword
    } else {
      outputExt = keyword
    }
  })

  if (!transform) {
    throw new Error('Please specify a valid transform')
  }

  inputExt = inputExt || processors[transform].inputExt
  outputExt = outputExt || processors[transform].outputExt

  const {promise, emitter} = sugarfreeify({
    inputExt,
    outputExt,
    transform: processors[transform].transform
  })

  emitter.on('finishedFile', ({inputFile, outputFile}) =>
    console.log(
      `${chalk.gray(inputFile)} ${chalk.green('=>')} ${chalk.gray(outputFile)}`
    )
  )

  return promise
}

module.exports = {run}

if (require.main === module) {
  run(cli.input, cli.flags)
}
