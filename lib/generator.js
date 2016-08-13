'use strict'

// const async = require('async')
const yieldCallback = require('yield-callback')

const docSource = require('./doc-source')

exports.generate = yieldCallback(generateGen)

// Generate the doc for the specified version.
function * generateGen (version, opts, cb) {
  console.log(`generating version: ${version}`)

  let err, indexJSON

  [err, indexJSON] = yield docSource.getIndexJSON(version, cb)

  const links = []
  if (err) return err
  for (let element of indexJSON.desc) {
    if (element.text) {
      const match = element.text.match(/\[.*\]\((.*)\)/)
      if (match) {
        console.log(`need to get ${match[1]}`)
      }
    }
  }
}

//  let [err, res, body] = yield request(DistIndexJSON, cb)
//  if (err) return err
//  if (res.statusCode !== 200) {
//    return new Error(`http status ${res.statusCode} from ${DistIndexJSON}`)
//  }

//  let versions
//  try {
//    versions = JSON.parse(body)
//  } catch (err) {
//    return err
//  }
