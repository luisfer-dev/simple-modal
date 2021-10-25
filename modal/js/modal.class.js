/* eslint-disable no-unused-vars */
class Modal {
  constructor (opts) {
    this.ID = this._generateID()
    this._prepare(this.ID)

    this.$instance = document.querySelector(`.modal-${this.ID}`)
    this.modal = this.$instance.querySelector('.modal')

    this._setHandle()
    // this.initDraggable()

    this._setDefaults(opts)
    this._setButtons(opts)
  }

  _setDefaults (opts) {
    const { title, content } = opts

    this.$instance.querySelector('.main-title').innerText = title
    this.$instance.querySelector('.content').innerHTML = content
  }

  _setButtons (opts) {
    const { buttons } = opts

    buttons.forEach(btn => {
      const { title, type, action } = btn
      const button = document.createElement('button')

      button.classList.add(`${type}-button`)
      button.innerHTML = title
      button.addEventListener('click', action)
      this.$instance.querySelector('.buttons').appendChild(button)
    })
  }

  _setHandle () {
    this.$instance.querySelectorAll('.close-modal').forEach(el => el.addEventListener('click', () => this.close()))
    this.$instance.querySelectorAll('.fullscreen-modal').forEach(el => el.addEventListener('click', () => this.toogleFullscreen()))
  }

  _generateID () {
    return Math.floor(Math.random() * (9999999999 - 0)) + 0
  }

  _prepare (ID) {
    document.body.insertAdjacentHTML('beforeend',
      `
        <div class="modal-container modal-${ID}">
          <div class="background">
            <div class="modal">

              <div class="title">
                <span class="main-title"></span>
                <div class="container-actions">
                  <div class="material-icons fullscreen-modal">fullscreen</div>
                  <div class="material-icons close-modal">clear</div>
                </div>
              </div>

              <div class="content"></div>

              <div class="buttons"></div>

            </div>
          </div>
        </div>
      `
    )
  }

  _destroy () {
    this.$instance.style.display = 'none'
    this.$instance.remove()
  }

  _animateCSS (node, animation, prefix = 'animate__') {
    return new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`
      if (node) {
        node.classList.add(`${prefix}animated`, animationName)

        function handleAnimationEnd (event) {
          event.stopPropagation()
          node.classList.remove(`${prefix}animated`, animationName)
          resolve('Animation ended')
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true })
      } else {
        console.warn('Element not found')
        resolve('Element not found')
      }
    })
  }

  show () {
    this.$instance.style.display = 'block'
    this._animateCSS(this.$instance.querySelector('.background'), 'fadeIn')
    this._animateCSS(this.$instance.querySelector('.modal'), 'bounceIn')
  }

  close () {
    this._animateCSS(this.$instance.querySelector('.modal'), 'bounceOut').then(() => {
      this.$instance.querySelector('.modal').style.display = 'none'
      this._animateCSS(this.$instance.querySelector('.background'), 'fadeOut').then(() => {
        this._destroy()
      })
    })
  }

  toogleFullscreen () {
    const text = this.$instance.querySelector('.fullscreen-modal').innerText
    this.$instance.querySelector('.fullscreen-modal').innerText = text === 'fullscreen' ? 'close_fullscreen' : 'fullscreen'

    this.modal.classList.toggle('fullscreen')
  }

  initDraggable () {
    let isDragActive = false
    let defaultValues = {}
    let originalPosition = {}
    let position = {}

    const updatePosition = () => {
      this.modal.style.transform = `translate(${position.x}px, ${position.y}px)`
    }

    this.modal.style.transform = 'translate(0px, 0px)'

    this.$instance.querySelector('.title').addEventListener('mousedown', e => {
      isDragActive = true

      const style = this.modal.style.transform.replace('translate(', '').replace(')', '').split(', ')

      const right = style[0].replace('px', '')
      const bottom = style[1].replace('px', '')

      originalPosition = {
        right: parseInt(right),
        bottom: parseInt(bottom)
      }

      defaultValues = {
        mouseX: e.clientX,
        mouseY: e.clientY
      }

      this.modal.classList.add('not-transition')
    })

    this.$instance.querySelector('.title').addEventListener('mousemove', e => {
      if (isDragActive) {
        position = {
          x: originalPosition.right - (defaultValues.mouseX - e.clientX),
          y: originalPosition.bottom - (defaultValues.mouseY - e.clientY)
        }

        updatePosition()
      }
    })

    this.$instance.querySelector('.title').addEventListener('mouseup', e => {
      console.log('mouseup')

      position = {
        x: originalPosition.right - (defaultValues.mouseX - e.clientX),
        y: originalPosition.bottom - (defaultValues.mouseY - e.clientY)
      }

      updatePosition()

      this.modal.classList.remove('not-transition')
      isDragActive = false
    })

    this.$instance.querySelector('.title').addEventListener('mouseleave', e => {
      console.log('mouseleave')
      console.log(e)

      position = {
        x: originalPosition.right - (defaultValues.mouseX - e.clientX),
        y: originalPosition.bottom - (defaultValues.mouseY - e.clientY)
      }

      updatePosition()
    })
  }
}
