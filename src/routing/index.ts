// , Request, Response
import * as fs from 'fs-extra'
import { join } from 'path'
import injectHtml from '~/injectHtml/InjectHtml'
import AppServer from '~/AppServer'

const defaultFile = 'dump.html'
const cwd = process.cwd()
const file = join(cwd, defaultFile)

export default (appServer: AppServer) => {
  const express = appServer.getExpress()

  express.get('/', async (req, res) => {
    const html = await fs.readFile(file, 'utf8')

    res.send(
      injectHtml(html, appServer.getPort())
    )
  })

  express.get('/admin', (req, res) => {
    res.send('Admin page')
  })
}
