'use strict'

const _ = require('lodash')
const babel = require('babel-plugin-try-catch-wrapper/lib/babel')
const path = require('path')
const through = require('through2')

module.exports = ({reportError = 'reportError'} = {}) => {
  const bufferContents = (file, enc, cb) => {
    const result = babel.transform(file.contents.toString(enc), {
      compact: true,
      plugins: [
        ['babel-plugin-try-catch-wrapper', {
          reportError: reportError,
          filename: path.relative(file.cwd || file.base, _.last(file.history))
        }]
      ]
    })

    file.contents = new Buffer(result.code)
    cb(null, file)
  }

  return through.obj(bufferContents)
}
