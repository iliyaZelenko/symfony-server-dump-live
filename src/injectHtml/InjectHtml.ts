import * as cheerio from 'cheerio'
import page from './page'

interface ContentGroupInterface {
  headContent?: string
  bodyContent?: string
}

type HTML = string
type cheerioObj = any

export default (html: HTML, serverPort: number) => {
  const content: ContentGroupInterface = getGroupedContent(html)

  return page({ serverPort, content })
}

/**
 * Добавляет кнопки в каждый article
 * @param {HTML} html
 * @return {cheerioObj} cheerio object
 */
function addButtons (html: HTML): cheerioObj {
  const $ = cheerio.load(html)

  $('section.body > p.text-small').each((i, el) => {
    if ($(el).find('.iz-toggle-all-btn').length) {
      return
    }

    const textOpenClose = ['Open all', 'Close all']

    $(el).append(`
      <button
        onclick="
        const articleBody = this.closest('section.body')
        const toggleSelector = 'pre.sf-dump .sf-dump-toggle'

        if (this.textContent.includes('${textOpenClose[0]}')) {
          articleBody
            .querySelectorAll(toggleSelector + ' + .sf-dump-compact')
            .forEach(i => i.previousElementSibling.click())

          this.textContent = '${textOpenClose[1]}'
        } else {
          articleBody
            .querySelectorAll(toggleSelector + ' + .sf-dump-expanded')
            .forEach(i => i.previousElementSibling.click())
          this.textContent = '${textOpenClose[0]}'
        }
        "
        class="iz-toggle-all-btn iz-btn"
      >
        ${textOpenClose[0]}
      </button>
    `)
    $(el).append(`
      <button
        onclick="this.closest('section.body').querySelectorAll('pre.sf-dump .sf-dump-toggle').forEach(i => i.click())"
        class="iz-toggle-all-btn iz-btn"
      >
        Toggle all
      </button>
    `)
    $(el).append(`
      <button
        onclick="
          const pre = this.closest('section.body').querySelector('pre.sf-dump')

          if (this.search) {
            const el = pre.querySelector('.sf-dump-search-wrapper')

            if (el) {
              el.classList.add('sf-dump-search-hidden')
            }

            this.search = false
            return
          }
          // pre.querySelector('sf-dump-search-wrapper').remove()
          pre.dispatchEvent(
            new KeyboardEvent('keydown',{ keyCode: 70, ctrlKey: true })
          )
          this.search = true
        "
        class="iz-toggle-all-btn iz-btn"
      >
        Search
      </button>
    `)

  })

  return $
}

// предыдущий article
let lastArticle: any = null

/**
 * Скрипт который в первую очередь и всегда выполняется для файла
 * @param {HTML} html
 * @return {cheerioObj} cheerio object
 */
function every (html: HTML): cheerioObj {
  const $ = addButtons(html)

  $('time').each((i, el) => {
    const datetime = $(el).attr('datetime')

    $(el).text(
      // toLocaleString
      new Date(datetime).toLocaleTimeString('ru-RU')
    )
  })

  return $
}

/**
 * Возвращает сгрупированный контент (разобранный)
 * @param {string} html контент файла
 * @return {ContentGroupInterface}
 */
function getGroupedContent (html: string): ContentGroupInterface {
  const content: ContentGroupInterface = {}

  // печально что нет DOMParser как в браузере (хоть где-то мне пригодился этот jquery xD)
  const $ = every(html)
  const articles = $('article')

  if (articles.length) {
    // хоть и last, но в браузере она первая (изменено через стили)
    const last = articles.last()

    if (last) {
      // ставит последнюю статью
      lastArticle = last
    }
  }

  const body = $('body').first()
  const head = $('head').first()

  if (head) {
    content.headContent = head.html()
  }

  content.bodyContent = body ? body.html() : html

  return content
}

/**
 * Обрабатывает новый HTML который пришел после обновления файла.
 * @param {string} html контент файла
 * @return {HTML | null}
 */
export function processUpdatedHtml (html: string): HTML | null {
  const $ = every(html)
  const last = $('article').last()

  if (last && lastArticle) {
    // если article совпадают (такая ситуация может возникнут ьесли вручную изменить html)
    if (last.attr('data-dedup-id') === lastArticle.attr('data-dedup-id')
      || !last.attr('data-dedup-id') || !lastArticle.attr('data-dedup-id')
    ) {
      console.log('File change is ignored because no new message was added.')

      // возвращает null который проигнорируется дальше
      return null
    }
  }

  lastArticle = last

  // обозначает что последняя запись была только создана чтобы применилаь анимация
  last.attr('data-iz-new-created', true)

  // добавляет скриптам
  last.find('script').each((i, el) => {
    if ($(el).attr('data-script-executed') !== 'true') {
      $(el).attr('data-script-executed', false)
    }
  })

  return $.html(last)
}
