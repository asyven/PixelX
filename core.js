const WebSocket = require('ws')
const axios = require('axios')

module.exports = class PixelBot {
  constructor (wsslink, store) {
    this.wsslink = wsslink
    this.MAX_WIDTH = 1590
    this.MAX_HEIGHT = 400
    this.MAX_COLOR_ID = 25
    this.MIN_COLOR_ID = 0

    this.SIZE = this.MAX_WIDTH * this.MAX_HEIGHT
    this.SEND_PIXEL = 0

    this.ws = null
    this.wsloaded = false
    this.busy = false

    this.isStartedWork = false
    this.rCode = null

    this.load(store).catch(console.error)
  }

  async load (store) {
    this.startWork(store)
  }

  async resolveCode (store) {
    try {
      const url = new URL(this.wsslink)
      const result = await axios.get('https://pixel2019.vkforms.ru/api/start', {
        headers: {
          'X-vk-sign': url.search,
        },
      })

      let code = result.data.response.code
      // eslint-disable-next-line no-eval
      code = eval(store.replaceAll(code, 'window.', ''))
      this.wsslink = this.wsslink.replace(/&c=.*/g, `&c=${code}`)
      console.log(`> Код решён: ${code}`)
    } catch (e) {
      console.log('> Произошла ошибка при решении кода.', e)
    }
  }

  async initWs (store) {
    await this.resolveCode(store)
    this.ws = new WebSocket(this.wsslink)

    this.ws.on('open', async () => {
      console.log('> Подключение к WebSocket было успешным.')
    })

    this.ws.on('message', async (event) => {
      while (this.busy) {
        await this.sleep(500)
      }

      try {
        this.busy = true

        if (typeof event === 'string') {
          try {
            const a = JSON.parse(event)
            if (a.v) {
              const codeRaw = a.v.code

              let code = codeRaw
              const funnyReplacesHs = {
                'window.': '',
                global: 'undefined',
              }
              for (const replace of Object.keys(funnyReplacesHs)) {
                code = store.replaceAll(code, replace, funnyReplacesHs[replace])
              }

              // eslint-disable-next-line no-eval
              this.rCode = eval(code)
              this.ws.send('R' + this.rCode)
              this.wsloaded = true
              console.log(`> Код-R решён: R${this.rCode}`)
            }
          } catch (e) {

          }
        } else {
          const c = this.toArrayBuffer(event)

          for (let d = c.byteLength / 4, e = new Int32Array(c, 0, d), f = Math.floor(d / 3), g = 0; g < f; g++) {
            const h = e[3 * g], k = this.unpack(h), l = k.x, m = k.y, n = k.color
            store.data[[l, m]] = n
          }
        }

        if (!this.isStartedWork) {
          this.startWork(store)
        }
        this.busy = false
      } catch (e) {
        this.busy = false
      }
    })

    this.ws.on('close', () => {
      this.ws = null
      this.wsloaded = false
    })
  }

  async sendPixel (store) {
    const keys = Object.keys(store.pixelDataToDraw)
    const ind = keys[Math.floor(Math.random() * keys.length)] // Рандомный элемент

    const color = store.pixelDataToDraw[ind]
    const coords = ind.split(',')
    if (store.data && store.data[ind] && store.data[ind] === color) return

    await this.send(color, this.SEND_PIXEL, coords[0], coords[1], store)
    if (store.data) {
      store.data[ind] = color
    }
    setTimeout(() => {
      this.sendPixel(store)
    }, 60000)
  }

  async startWork (store) {
    console.log('> Производится запуск скрипта.')
    this.isStartedWork = true
    await store.load()
    await this.sendPixel(store)
  }

  async send (colorId, flag, x, y, store) {
    const c = new ArrayBuffer(4)
    new Int32Array(c, 0, 1)[0] = this.pack(colorId, flag, x, y)
    if (!this.ws) {
      await this.initWs(store)
    }
    while (!this.wsloaded) {
      await this.sleep(500)
    }
    this.ws.send(c)
    console.log(`> Был раскрашен пиксель [${x}, ${y}] (${colorId})`)
  }

  pack (colorId, flag, x, y) {
    const b = parseInt(colorId, 10) + parseInt(flag, 10) * this.MAX_COLOR_ID
    return parseInt(x, 10) + parseInt(y, 10) * this.MAX_WIDTH + this.SIZE * b
  }

  unpack (b) {
    const c = Math.floor(b / this.SIZE)
    const d = (b -= c * this.SIZE) % this.MAX_WIDTH
    return {
      x: d,
      y: (b - d) / this.MAX_WIDTH,
      color: c % this.MAX_COLOR_ID,
      flag: Math.floor(c / this.MAX_COLOR_ID),
    }
  }

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  toArrayBuffer (buf) {
    const ab = new ArrayBuffer(buf.length)
    const view = new Uint8Array(ab)
    for (let i = 0; i < buf.length; ++i) {
      view[i] = buf[i]
    }
    return ab
  }

  chunkString (str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'))
  }

  shuffle (array) {
    let currentIndex = array.length, temporaryValue, randomIndex

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }
}
