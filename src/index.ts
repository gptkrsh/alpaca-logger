import { createLogger, format, Logger } from 'winston'
import { Console } from 'winston/lib/winston/transports'

import deepmerge from 'deepmerge'
import emoji from 'node-emoji'
import nodeColors from 'colors'

interface AlpacaOptions {
  components?: {
    date?: Boolean
    time?: Boolean
    emoji?: Boolean
    colors?: Boolean
  }
}

const defaultOptions: AlpacaOptions = {
  components: {
    date: true,
    time: true,
    emoji: true,
    colors: true
  }
}

type levels = 'success' | 'error' | 'warn' | 'info' | 'note' | 'debug'

export class Alpaca {
  config: AlpacaOptions
  levels: { [key in levels]: number }
  private logger: Logger

  constructor (options: AlpacaOptions) {
    console.log('')

    this.config = deepmerge(defaultOptions, options ?? {})

    this.levels = {
      success: 0,
      error: 0,
      warn: 1,
      info: 2,
      note: 2,
      debug: 3
    }

    this.logger = createLogger({
      level: 'debug',
      levels: this.levels,
      transports: [new Console()],
      format: format.printf((info: { level: string; message: string; }) => {
        const DateTime = new Date()

        const date = `${DateTime.getDate()}/${DateTime.getMonth() + 1}/${DateTime.getFullYear()}`
        const time = `${DateTime.getHours()}:${DateTime.getMinutes()}:${DateTime.getSeconds()}`

        const components: Array<string> = []

        if (this.config?.components?.date) {
          components.push(this.config.components.colors ? nodeColors.gray(date) : date)
        }

        if (this.config?.components?.time) {
          components.push(this.config.components.colors ? nodeColors.gray(time) : time)
        }

        if (this.config?.components?.emoji) {
          components.push(this.levelEmoji(info.level as levels))
        }

        components.push(this.config?.components?.colors ? this.levelColors(info.level as levels) : info.level)

        return `${components.join(' ')} ${info.message}`
      })
    })
  }

  private levelEmoji (level: levels): string {
    const levels = Object.keys(this.levels)
    if (!levels.includes(level)) { throw this.log('error', `${level} is not a valid level`) }

    const emojiMap = {
      success: 'white_check_mark',
      error: 'x',
      warn: 'construction',
      info: 'loudspeaker',
      note: 'memo',
      debug: 'bug'
    }

    return emoji.emojify(`${emoji.get(emojiMap[level])}`)
  }

  private levelColors (level: levels): string {
    const colors = {
      success: nodeColors.green,
      error: nodeColors.red,
      warn: nodeColors.yellow,
      info: nodeColors.blue,
      note: nodeColors.cyan,
      debug: nodeColors.gray
    }

    return colors[level](level)
  }

  log (level: levels, message: string) {
    this.logger.log(level, message)

    return this
  }
}
