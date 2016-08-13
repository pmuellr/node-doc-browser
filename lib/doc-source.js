'use strict'

const request = require('request')
const yieldCallback = require('yield-callback')

exports.getNodeVersions = yieldCallback(getNodeVersionsGen)
exports.getIndexJSON = yieldCallback(getIndexJSONGen)

const DistIndexJSON = 'https://nodejs.org/dist/index.json'

// Return the Node.js versions array in the callback.
function * getNodeVersionsGen (cb) {
  let [err, res, body] = yield request(DistIndexJSON, cb)

  if (err) return err
  if (res.statusCode !== 200) {
    return new Error(`http status ${res.statusCode} from ${DistIndexJSON}`)
  }

  let versions
  try {
    versions = JSON.parse(body)
  } catch (err) {
    return err
  }

  // need to return an array here, since versions is also an array
  return [null, versions]
}

// Return the index.json content for a specific version.
function * getIndexJSONGen (version, cb) {
  const url = `https://nodejs.org/dist/${version}/docs/api/index.json`

  let [err, res, body] = yield request(url, cb)

  if (err) return err
  if (res.statusCode !== 200) {
    return new Error(`http status ${res.statusCode} from ${url}`)
  }

  try {
    return [null, JSON.parse(body)]
  } catch (err) {
    return err
  }
}
