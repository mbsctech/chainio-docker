#!/usr/bin/env node

// If given a build directory, try and surmize the name of the builds to push - based on defaults
// used in the build script.

const { parseArgs } = require('node:util')
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

let dryRun
const isDryRun = () => {
  return dryRun === true
}

const log = (message) => {
  console.log(`${new Date().toISOString()} - ${message}`)
}

const error = (message, error) => {
  if (message) {
    console.error(`${new Date().toISOString()} - ${message}`)
  }
  if (error) {
    console.error(error)
  }
}

const isDirectory = (dir) => {
  try {
    return fs.statSync(dir).isDirectory()
  } catch (er) {}
  return false
}

const getDirectoryNameFromPath = (dirPath) => {
  return dirPath.split(path.sep).slice(-1)
}

const getArgs = () => {
  const commandLineOptions = {
    buildDir: {
      type: 'string'
    },
    platforms: {
      type: 'string'
    }
  }
  const { values } = parseArgs({ options: commandLineOptions, strict: false, allowPositionals: true })
  dryRun = values.dryRun
  if (!values.buildDir) {
    error('You must specify the build directory to push.')
    return
  } else if (!isDirectory(values.buildDir)) {
    error(`The buildDir '${buildDir}' does not exist`)
    return
  }

  const rawPlatforms = values.platforms || 'linux/amd64, linux/arm64'
  const platforms = rawPlatforms.split(',').map(v => v.trim())
  if (!platforms.length) {
    error('You must specify at least one platform to push.')
    return
  }

  return {
    buildDir: values.buildDir,
    platforms
  }
}

const getBaseImageNames = (buildDir) => {
  const names = []
  const buildDirName = getDirectoryNameFromPath(buildDir)
  if (isDirectory(path.join(buildDir, 'build'))) {
    names.push(`chainio/${buildDirName}`)
  }

  if (isDirectory(path.join(buildDir, 'test'))) {
    names.push(`chainio/${buildDirName}-test`)
  }

  if (names.length === 0) {
    // If there's no build or test folder in the build dir, then fall back to the legacy naming style
    names.push(`chainio/lambda-ci-${buildDirName}`)
  }

  return names
}

const getImageNamesToPush = (args) => {
  const names = getBaseImageNames(args.buildDir)
  return names.map((name) => {
    return args.platforms.map((platform) => {
      const [, architecture] = platform.split('/')
      return `${name}-${architecture}`
    })
  }).flat()
}

const pushImage = (imageName) => {
  log(`Pushing image named ${imageName} to Docker Hub`)
  return runCommand(`docker push ${imageName}`)
}

const runCommand = (command) => {
  if (isDryRun()) {
    log(`DRY RUN command: ${command}`)
    return true
  } else {
    log(`Executing command: ${command}`)
  }

  const result = spawnSync(command, { stdio: ['inherit', 'inherit', 'inherit'], shell: true})
  if (result.error) {
    error(result.error)
    return false
  }

  return true
}

const run = () => {
  const args = getArgs()
  if (!args) {
    return
  }

  const imageNames = getImageNamesToPush(args)
  log(`Pushing ${imageNames.length} image${imageNames.length === 1 ? '' : 's'}`)
  for (const imageName of imageNames) {
    if (!pushImage(imageName)) {
      error(`Failed to push image ${imageName}`)
      return
    }
  }
}

run()
