import test from 'ava'

import globby from 'globby'
import {join} from 'path'
import fs from 'then-fs'
import path from 'path'

import rmfr from 'rmfr'
import sugarfreeify from '..'

const read = file => fs.readFile(file, 'utf-8')

const fixture = dir => {
  return file => path.join(
    path.join(__dirname, 'fixtures'),
    path.join(dir, file)
  )
}

test('sss is converted to css', async t => {
  await rmfr(fixture('css')('input.css'))
  await sugarfreeify.run(['sugarss'])
  const expected = await read(fixture('css')('expected.css'))
  const actual = await read(fixture('css')('input.css'))
  t.deepEqual(expected, actual)
})

test('sgr is converted to html', async t => {
  await rmfr(fixture('html')('input.html'))
  await sugarfreeify.run(['sugarml'])
  const expected = await read(fixture('html')('expected.html'))
  const actual = await read(fixture('html')('input.html'))
  t.deepEqual(expected, actual)
})
