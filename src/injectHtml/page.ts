import css from './css'
import js from './js'

const pageTitle = 'Symfony server:dump'

export default ({ serverPort, content }) => `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    >
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${pageTitle}</title>

    ${css}

    ${js(serverPort)}

    ${content.headContent}
  </head>
  <body>
    <div id="iz-app">
      <div id="iz-background" :style="{ background: color }"></div>
      <div class="iz-trash" title="Removes all messages from page." @click="trash">
        <img
          src="https://findicons.com/files/icons/1580/devine_icons_part_2/128/trash_recyclebin_empty_closed.png"
          alt="Trash"
          style="width: 100%;"
        >
      </div>
      <div class="iz-width" title="Changes width of container." @click="toggleWidth">
        <img
          src="http://www.iconarchive.com/download/i83709/custom-icon-design/mono-general-4/eye.ico"
          alt="Eye"
          style="width: 100%;"
        >
      </div>
      <div class="iz-color" title="Background color.">
        <input v-model="color" type="color" name="iz-color">
        <!--<label for="iz-color">Background color</label>-->
      </div>
    </div>
    <div data-iz-symfony-dump-watcher>
      <div id="iz-no-content">
        Looks like dump is empty.
      </div>
      ${content.bodyContent}
    </div>
  </body>
  </html>
`
