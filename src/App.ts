import chalk from 'chalk'
import * as CLI from 'commander'
import * as fs from 'fs-extra'
import { join } from 'path'
import DefaultConfig from '~/config/DefaultConfig'
import AppServer from '~/AppServer'
import WebSocket from '~/WebSocket'
import CLIParamsInterface from '~/CLIParamsInterface'
import * as packageJson from '~/../package.json'

const { version: appVersion } = packageJson
const { defaultFileName, defaultFilePath, defaultHost, defaultPort, defaultNoOpen } = DefaultConfig

export default class App {
  // по правилас TSLint статические методы должны быть в саммо начале, даже раньше аттрибутов
  public static getWarningText (msg: string) {
    const warning = chalk.keyword('orange')

    return warning(msg)
  }
  public static getErrorText (msg: string) {
    const error = chalk.bold.red

    return error(msg)
  }

  private readonly CLIParams: CLIParamsInterface
  private readonly appServer: AppServer
  // показано ли предупреждение о том что path параметр из CLI является директорией.
  private CLIPathIsDirectoryNoticeShowed: boolean = false

  public constructor () {
    const { host, port, open, runDump } = this.CLIParams = this.makeCLI()
    const fileToWatch = this.getFileToWatch()

    // console.log(fileToWatch)

    if (runDump) {
      this.runServerDump()
    }

    if (!fs.pathExistsSync(fileToWatch)) {
      const msg = App.getWarningText(`We did not find a file ${fileToWatch}.`) +
        '\nIt is required that "server:dump" worked with this file by itself. ' +
        'We created the file manually, but you have to start "server:dump" with this file, for example: ' +
        chalk.blue('php ./bin/console server:dump --format=html > dump.html')

      console.log(msg)

      // создает файл если его нет чтобы не было ишибки на сокете и express серверах
      fs.ensureFileSync(fileToWatch)
      // пишет в файл контент TODO описать лучше
      fs.writeFileSync(fileToWatch, '<div style="text-align: center;">This file created manually.</div>')
    }

    this.appServer = new AppServer(this, port, host, open).start()
    new WebSocket(this).start()
  }

  public getAppServer () {
    return this.appServer
  }

  public getCLIParams () {
    return this.CLIParams
  }

  public getFileToWatch () {
    const path = join(process.cwd(), this.CLIParams.path)
    let newPath

    if (fs.pathExistsSync(path) && fs.lstatSync(path).isDirectory()) {
      newPath = join(path, defaultFileName)

      if (!this.CLIPathIsDirectoryNoticeShowed) {
        console.log(
          App.getWarningText(`Your path "${path}" does not contain a file, we changed it to "${newPath}", ` +
            'if you have a different file name, add it.')
        )

        this.CLIPathIsDirectoryNoticeShowed = true
      }

      return newPath || path
    }

    return path
  }

  private makeCLI (): CLIParamsInterface {
    // TODO перемеиновать dist/index.js в dump-server, чтобы usage в help норм отображался
    CLI
      .version(appVersion, '-v, --version')
      .usage('[options]')
      .option('--host [host]', 'server host', defaultHost)
      .option('-p, --port [port]', 'server port', defaultPort)
      .option('-b, --path [path]', 'path to file generated by Symfony\'s "server:dump" command.', defaultFilePath)
      .option('-r, --run-dump', 'manually runs Symfony\'s "server:dump" command (uses dump.html).')
      .option('--no-open', 'it won\'t open your browser.', defaultNoOpen)
      .parse(process.argv)

    const { host, port, path, open, runDump } = CLI

    return {
      host,
      port,
      path,
      open,
      runDump
    }
  }

  private runServerDump () {
    // runner.exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
    //   if(err) console.log(err); /* log error */
    //   console.log( phpResponse );
    // });
    console.log('Running server:dump...')

    // https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
    const { spawn } = require('child_process')
    // const child =
    // spawn('php', [
    //   join(process.cwd(), 'bin/console'),
    //   'server:dump'
    // ], { env: { FORCE_COLOR: true }, shell: true, stdio: 'inherit' })

    spawn(`php ${join(process.cwd(), 'bin', 'console')} server:dump --format=html > dump.html`, [], {
      // заметил результат только от stdio: 'inherit'
      env: { FORCE_COLOR: true }, shell: true, stdio: 'inherit'
    })

    // child.stdout.setEncoding('utf8')
    // child.stderr.setEncoding('utf8')
    // use child.stdout.setEncoding('utf8'); if you want text chunks

    // child.stdout.on('data', (chunk) => {
    //   // console.log('Info: ' + chunk)
    //   // запускается когда выводится dump
    //   console.log(chunk)
    //   // data from standard output is here as buffers
    // })
    // // err
    // child.stderr.on('data', (data) => {
    //   // console.log('stderr: ' + data)
    //   // почему-то выводится при старте
    //   console.log(data)
    // })
    //
    // child.on('error', (err) => {
    //   console.log('Error: ' + err)
    // })
    //
    // child.on('close', (code) => {
    //   console.log(`Child process exited with code ${code}.`)
    // })
    //
    // child.on('exit', (code, signal) => {
    //   console.log('child process exited with ' +
    //     `code ${code} and signal ${signal}`)
    // })
  }
}
