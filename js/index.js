let modal
const options = {
  title: 'Titulo del modal',
  content: `Contenido del modal: ${0}`,
  buttons: [
    {
      title: 'Aceptar',
      type: 'primary',
      action () {
        modal.close()
      }
    }, {
      title: 'Cerrar',
      type: 'red',
      action () {
        modal.close()
      }
    }
  ]
}

document.addEventListener('DOMContentLoaded', () => {
  /**
    <button>Default</button>
    <button class="primary-button">Primary</button>
    <button class="red-button">Error</button>
   */

  // eslint-disable-next-line no-undef
  modal = new Modal(options)

  modal.show()

  document.querySelector('.btn-start').addEventListener('click', () => {
    // eslint-disable-next-line no-undef
    modal = new Modal(options)
    modal.show()
  })
})
