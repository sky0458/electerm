const { rm, echo } = require('shelljs')
const {
  run,
  writeSrc,
  builder,
  patchNsisKeepShortcuts
} = require('./build-common')

async function main () {
  const pb = builder
  echo('running private Windows x64 NSIS build')

  patchNsisKeepShortcuts()

  const src = 'win-x64-installer.exe'
  rm('-rf', 'dist')
  writeSrc(src)

  // This fork keeps package.json metadata pointing at upstream electerm/electerm.
  // Never let electron-builder initialize or publish through that upstream target.
  await run(`${pb} --win nsis --publish never`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
