const { rm, echo } = require('shelljs')
const {
  run,
  writeSrc,
  uploadToR2,
  builder,
  patchNsisKeepShortcuts
} = require('./build-common')

async function main () {
  const pb = builder
  echo('running build for Windows 10+ x64 NSIS installer')

  patchNsisKeepShortcuts()

  echo('build Windows x64 nsis')
  const src = 'win-x64-installer.exe'
  rm('-rf', 'dist')
  writeSrc(src)
  await run(`${pb} --win nsis --x64`)
  await uploadToR2(src)
}

main()
