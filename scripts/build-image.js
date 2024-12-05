#!/usr/bin/env node

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

const isFile = (dir) => {
  try {
    return fs.statSync(dir).isFile()
  } catch (er) {}
  return false
}

const getDirectoryNameFromPath = (dirPath) => {
  return dirPath.split(path.sep).slice(-1)
}

const validateBuildDirectory = (buildDir) => {
  if (!isDirectory(buildDir)) {
    error(`The buildDir '${buildDir}' does not exist`)
    return
  }

  // Older builds only use a single image...check for build/test dirs.  If present return the dockerfile
  // paths for both.  If not, return only the build image.
  const lambdaCiBuild = path.join(buildDir, 'build')
  const lambdaCiTest = path.join(buildDir, 'test')
  if (isDirectory(lambdaCiBuild) && isDirectory(lambdaCiTest)) {
    const buildDockerFile = path.join(lambdaCiBuild, 'Dockerfile')
    const testDockerFile = path.join(lambdaCiTest, 'Dockerfile')

    if (isFile(buildDockerFile) && isFile(testDockerFile)) {
      return { build: buildDockerFile, test: testDockerFile}
    }

    error(`Could not locate build/Dockerfile and/or test/Dockerfile in directory '${buildDir}'`)
  } else {
    const dockerFile = path.join(buildDir, 'Dockerfile')
    if (isFile(dockerFile)) {
      return { build: dockerFile }
    }

    error(`Could not locate legacy Dockerfile in directory '${buildDir}'`)
  }
}

const getArgs = () => {
  const commandLineOptions = {
    buildDir: {
      type: 'string'
    },
    tagPrefix: {
      type: 'string'
    },
    platforms: {
      type: 'string'
    }
  }
  const { values } = parseArgs({ options: commandLineOptions, strict: false, allowPositionals: true })
  dryRun = values.dryRun
  if (!values.buildDir) {
    error('You must specify the build directory to use.')
    return
  }

  // TODO - validate platforms
  const rawPlatforms = values.platforms || 'linux/amd64, linux/arm64'
  const platforms = rawPlatforms.split(',').map(v => v.trim())

  if (!platforms.length) {
    error('You must specify at least one platform to build.')
    return
  }

  const {build, test} = validateBuildDirectory(values.buildDir) || {}
  if (!build) {
    return
  }

  let tagPrefix = values.tagPrefix
  if (!tagPrefix) {
    // Generate a tagPrefix from the directory name
    // Not using path.parse because dirs with periods in them
    // appear to parse as files
    const dirName = getDirectoryNameFromPath(values.buildDir)

    if (test) {
      tagPrefix = dirName
    } else {
      // use legacy naming if test directory isn't present
      tagPrefix = `lambda-ci-${dirName}`
    }
  }

  return {
    dockerBuild: build,
    dockerTest: test,
    tagPrefix,
    platforms,
    dryRun: values.dryRun
  }
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

const buildTag = (platform, buildType, tag) => {
  const tagComponents = [`chainio/${tag}`]

  if (buildType !== 'build') {
    tagComponents.push(buildType)
  }

  // The only valid platforms for us are linux/amd64 and linux/arm64 so just strip
  // the linux and add to the tag as -amd64 and -arm64
  const [, architecture] = platform.split('/')
  if (architecture) {
    tagComponents.push(architecture)
  }

  return tagComponents.join('-')
}

const getBuildContext = (dockerFile) => {
  const parentDir = path.parse(dockerFile).dir
  if (!parentDir) {
    return '.'
  }

  return parentDir
}

const build = ({dockerFile, platform, buildType, tagPrefix}) => {
  const actualTag = buildTag(platform, buildType, tagPrefix)
  const buildContxt = getBuildContext(dockerFile)
  log(`Building image using Dockerfile ${dockerFile} for platform ${platform} and tagging as ${actualTag} using build context of ${buildContxt}`)
  if (runCommand(`docker buildx build --platform ${platform} --file ${dockerFile} -t ${actualTag} ${buildContxt}`)) {
    return true
  }
  error('Failed to build image')
  return false
}

const run = () => {
  const { dockerBuild, dockerTest, tagPrefix, platforms } = (getArgs() || {})
  if (!dockerBuild) {
    return
  }
  const dockerBuilds = platforms.map((platform) => {
    const args = []
    args.push({ dockerFile: dockerBuild, buildType: 'build', platform, tagPrefix })
    if (dockerTest) {
      args.push({ dockerFile: dockerTest, buildType: 'test', platform, tagPrefix })
    }
    return args
  }).flat()

  log(`Executing ${dockerBuilds.length} builds.`)
  for (const buildArgs of dockerBuilds) {
    if (!build(buildArgs)) {
      error('The build failed to complete.  Fix the build error before continuing.')
      return
    }
  }
}

run()
