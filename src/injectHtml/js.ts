// скрипт добавляет в тег header класс hidden, но не совсем понятно при каких условиях
// зато понятно что скрипт должен выполнятся каждый для всех элементов, то есть его надо вызывать и для ново-добавленных
// понял я это по этой строчке: document.addEventListener('DOMContentLoaded', function() {
const symfonyScript = `
+(function () {
  let prev = null;
  Array.from(document.getElementsByTagName('article')).reverse().forEach(function (article) {
    const dedupId = article.dataset.dedupId;
    if (dedupId === prev) {
      article.getElementsByTagName('header')[0].classList.add('hidden');
    }
    prev = dedupId;
  });
})()
`

export default (serverPort) => `
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>
<!--Injected script that changes the contents-->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    window.containerForContent = document.querySelector('[data-iz-symfony-dump-watcher]') // body
    const socket = io.connect('http://localhost:${serverPort}')

    checkArticlesCount()

    const app = new Vue({
      el: '#iz-app',
      data () {
        const widthAllowed = ['1140px', '100%', '500px']

        return {
          width: localStorage.getItem('iz-width') || widthAllowed[0],
          color: localStorage.getItem('iz-color') || '#F9F9F9',
          widthAllowed
        }
      },
      created () {
        this.setWidth()
      },
      watch: {
        color () {
          localStorage.setItem('iz-color', this.color)
        }
      },
      methods: {
        trash () {
          containerForContent.innerHTML = ''

          checkArticlesCount()
        },
        toggleWidth () {
          let widthIndex = this.widthAllowed.indexOf(this.width) + 1

          if (widthIndex === this.widthAllowed.length) {
            widthIndex = 0
          }

          this.width = this.widthAllowed[widthIndex]
          this.setWidth()
        },
        setWidth () {
          containerForContent.style.maxWidth = this.width
          localStorage.setItem('iz-width', this.width)
        }
      }
    })

    socket.on('apply full content', (html) => {
      // calling document.write on a closed (loaded) document automatically calls document.open,
      // which will clear the document.
      // document.open()
      // document.open()
      // document.write(html)
      // document.close()
      // document.documentElement.innerHTML = html
      // TOOD чтобы срабатывало Message added.

      location.reload()
    })

    socket.on('changed', (data) => {
      const beforeCount = checkArticlesCount()
      // select element with this data attr
      // containerForContent.innerHTML += data
      // containerForContent.innerHTML += data
      containerForContent.insertAdjacentHTML('beforeend', data)
      // скрипты которые только были добавленны имеют специальный аттрибут, эти скрипты нужно выполнить
      containerForContent.querySelectorAll('script[data-script-executed="false"]').forEach((el) => {
        // обозначает что скрипт был выполнен
        el.setAttribute('data-script-executed', true)
        // el.removeAttribute('data-script-executed')

        // выполняет содержимое скрипта (eval is good here)
        eval(
          el.textContent
        )
      })

      // скрипт которй должен вызывается после обновления DOM
      ${symfonyScript}

      const afterCount = checkArticlesCount()

      if (afterCount === beforeCount + 1) {
        socket.emit('feedback', 'Message added.')
      }
    })

    // скрипт которй должен вызывается при заходе на страницу
    ${symfonyScript}
  })

  function checkArticlesCount () {
    const text = containerForContent.querySelector('#iz-no-content')
    const count = containerForContent.querySelectorAll('article').length

    if (count) {
      text.classList.add('iz-no-content--hidden')
    } else {
      text.classList.remove('iz-no-content--hidden')
    }

    return count
  }
</script>
`