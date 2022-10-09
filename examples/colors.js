const { Alpaca } = require('../')

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Your app doesn't need to be in a function, this is done only to use async/await with sleep
async function main () {
  const withColors = new Alpaca()

  withColors.log('note', 'Found 8000 files to scan for viruses')
  withColors.log('info', 'Starting to scan all files...')
  withColors.log('success', 'Scanned & Recorded 8000 files')
  withColors.log('warn', 'deprecated-package is deprecated, please upgrade to new-package')
  withColors.log('error', 'TypeError: XYZConstant is not a constructor')

  await sleep(20 * 100)

  const withoutColors = new Alpaca({ components: { colors: false } })

  withoutColors.log('note', 'Found 8000 files to scan for viruses')
  withoutColors.log('info', 'Starting to scan all files...')
  withoutColors.log('success', 'Scanned & Recorded 8000 files')
  withoutColors.log('warn', 'deprecated-package is deprecated, please upgrade to new-package')
  withoutColors.log('error', 'TypeError: XYZConstant is not a constructor')

  await sleep(20 * 100)
}

main()
