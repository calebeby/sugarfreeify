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

process.chdir(__dirname)

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

test('errors if no transform is specified', async t => {
  t.throws(() => sugarfreeify.run([]), 'Please specify a valid transform')
})

test('custom input extension', async t => {
  await rmfr(fixture('custom')('input.html'))
  await sugarfreeify.run(['custom', 'sugarml'])
  const expected = await read(fixture('custom')('expected.html'))
  const actual = await read(fixture('custom')('input.html'))
  t.deepEqual(expected, actual)
})

test('custom output extension', async t => {
  await rmfr(fixture('customout')('input.foobar'))
  await sugarfreeify.run(['abcd', 'sugarml', 'foobar'])
  const expected = await read(fixture('customout')('expected.foobar'))
  const actual = await read(fixture('customout')('input.foobar'))
  t.deepEqual(expected, actual)
})
