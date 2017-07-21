#!/usr/bin/env node
const reshape = require('reshape')
const fs = require('then-fs')
const globby = require('globby')
const sugarml = require('sugarml')
const beautify = require('reshape-beautify')
const path = require('path')

const reshapeConfig = {
  parser: sugarml,
  plugins: [beautify()]
}

const getFiles = () => globby('**/*.sgr')

const processFile = file => {
  const newFile = path.join(path.dirname(file), path.basename(file, 'sgr') + 'html')
  fs.readFile(file, 'utf-8')
    .then(text => reshape(reshapeConfig).process(text))
    .then(res => res.output())
    .then(newText => fs.writeFile(newFile, newText))
}

getFiles()
  .then(files => Promise.all(files.map(processFile)))
  .then(done =>  console.log(done))

// reshape({})
//   .process(htmlInput)
//   .then((res) => {
//     res.output({ name: 'reshape' })
//   })
//   .then()
