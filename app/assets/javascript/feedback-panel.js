class FeedbackPanel {

  constructor($module) {
    this.$module = $module
    this.$feedbackButtons = $module.querySelector('[data-module="feedback-panel__buttons"]')
    this.$feedbackComments = $module.querySelector('[data-module="feedback-panel__comments"]')
    this.$title = $module.querySelector('[data-module="feedback-panel__title"]')
    this.$close = $module.querySelector('[data-module="feedback-panel__close"]')
    this.$sendCommentsButton = this.$feedbackComments.querySelector('.nhsuk-button')
  }

  init() {
    this.$feedbackComments.hidden = true
    this.$feedbackButtons.querySelectorAll('.nhsuk-button').forEach((button) => {
      button.addEventListener('click', this.hideButtons.bind(this))
    })
    this.$close.addEventListener('click', this.hidePanel.bind(this))
    this.$sendCommentsButton.addEventListener('click', this.hidePanel.bind(this))

  }

  hidePanel() {
    this.$module.hidden = true
  }

  hidePanelAndSayThanks() {
    this.$module.setAttribute('class', 'nhsuk-u-margin-bottom-4')
    this.$module.innerHTML = '<p class="nhsuk-body">Feedback sent.</p>'
  }


  hideButtons(event) {
    const thanksMessage = event.target.getAttribute('data-thanks')

    if (thanksMessage) {
      this.$title.textContent = thanksMessage
    } else {
      this.$title.textContent = 'Thanks'
    }

    this.$feedbackButtons.hidden = true
    this.$feedbackComments.hidden = false

  }

}

function initFeedbackPanels() {

  const feedbackPanels = document.querySelectorAll('[data-module="feedback-panel"]')

  feedbackPanels.forEach((el) => {
    new FeedbackPanel(el).init()
  })

}

document.addEventListener('DOMContentLoaded', initFeedbackPanels)
