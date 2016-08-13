#!/usr/bin/env node

'use strict'

const yargs = require('yargs')
const yieldCallback = require('yield-callback')

const docSource = require('./lib/doc-source')
const generator = require('./lib/generator')

const pkgJSON = require('./package.json')

const argv = yargs
  .alias('v', 'version')
  .alias('h', 'help')
  .argv

if (argv.version) {
  console.log(pkgJSON.version)
  process.exit(0)
}

if (argv.help || argv._[0] === '?') {
  printHelp()
  process.exit(0)
}

let argVersion = argv._[0]
if (argVersion && argVersion[0] !== 'v') argVersion = `v${argVersion}`

// Run main, as a yield callback, on next event cycle.
setImmediate(yieldCallback(mainGen), (err) => {
  if (err == null) return

  console.log(`error: ${err.message}`)
})

// Main processing here.
function * mainGen (cb) {
  let err, versions

  [err, versions] = yield docSource.getNodeVersions(cb)
  if (err) return err

  let version

  if (argVersion) {
    if (!hasVersion(argVersion, versions)) {
      return new Error(`invalid version ${argVersion}`)
    }
    version = argVersion
  } else {
    version = getFirstLtsVersion(versions)
  }

  [err] = yield generator.generate(version, {}, cb)
  if (err) return err
}

// Return whether the specified version is in list of specified versions.
function hasVersion (version, versions) {
  for (let testVersion of versions) {
    if (testVersion.version === version) return true
  }
  return false
}

// Return the greatest LTS version.
function getFirstLtsVersion (versions) {
  for (let version of versions) {
    if (version.lts) return version.version
  }
}

// Print some help.
function printHelp () {
  console.log('Generate a 3 pane HTML browser for Node.js doc.')
  console.log('')
  console.log(`usage: ${pkgJSON.name} [options] [Node.js version]`)
  console.log('')
  console.log('If a Node.js version is not specified, current stable is used.')
  console.log('')
  console.log('options:')
  console.log('  -v --version      print the current version')
  console.log('  -h --help         print the help text')
  console.log('')
  console.log('for more information, see: https://github.com/pmuellr/node-doc-browser.js')
}
