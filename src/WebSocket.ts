import * as socketIo from 'socket.io'
import * as fs from 'fs'
import * as fsExtra from 'fs-extra'
import App from '~/App'
import { join } from 'path'
import injectHtml, { processUpdatedHtml } from '~/injectHtml/InjectHtml'

export default class WebSocket {
  private io: SocketIO.Server
  private app: App

  public constructor (app: App) {
    this.app = app
    this.io = socketIo(this.app.getAppServer().getServer())
  }

  public start () {
    this.listen()
  }

  private async listen () {
    // в мс
    const watchFileInterval = 500
    const { path: filePath } = this.app.getCLIParams()
    const fileToWatch = join(process.cwd(), filePath)

    // console.log('!!!', fileToWatch)
    let initAdded = false

    this.io.on('connect', async (socket: any) => {
      // console.log('Client connected.')

      let initialContent = await this.getFileContent(fileToWatch)

      if (!initAdded) {
        // сразу после подключения менять весь контент
        const html = await this.generateInitialHtml(initialContent)
        socket.emit('apply full content', html)

        initAdded = true
      }

      fs.watchFile(fileToWatch, { interval: watchFileInterval }, async (curr, prev) => {
        // console.log('Content changed.')

        const content = await this.getFileContent(fileToWatch)

        if (initialContent === '') {
          const html = await this.generateInitialHtml(content)

          socket.emit('apply full content', html)

          // ignore initialContent next time
          initialContent = false
        } else {
          const html = processUpdatedHtml(content)

          if (html) {
            socket.emit('changed', html)
          }
        }
        // console.log(`the current mtime is: ${curr.mtime}`)
        // console.log(`the previous mtime was: ${prev.mtime}`)
      })

      socket.on('feedback', console.log)

      socket.on('disconnect', () => {
        // console.log('Client disconnected.')
      })
    })
  }

  private async getFileContent (fileToWatch) {
    return fsExtra.readFile(fileToWatch, 'utf8')
  }

  private async generateInitialHtml (content) {
    return injectHtml(content, this.app.getAppServer().getPort())
  }
}
