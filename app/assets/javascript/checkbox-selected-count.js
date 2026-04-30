import { Component, I18n } from 'nhsuk-frontend'

/**
 * Checkbox Selected Count component
 *
 * Displays a count of selected checkboxes within a container with pluralization support.
 *
 * Usage:
 * - Add `data-module="app-checkboxes-count-select"` to a wrapper element
 * - Add an element with pluralization attributes:
 *   `<p data-i18n-selected-count.one="item" data-i18n-selected-count.other="items"></p>`
 * - Checkboxes with `data-select-all` attribute are excluded from the count
 *
 * @augments Component<HTMLElement>
 */
export class CheckboxSelectedCount extends Component {
  static elementType = HTMLElement

  /**
   * Name for the component used when initialising using data-module attributes
   */
  static moduleName = 'app-checkboxes-count-select'

  /**
   * @param {Element | null} $root - HTML element to use for component
   */
  constructor($root) {
    super($root)

    this.$countDisplay = this.$root.querySelector('[data-i18n-selected-count\\.one]')
    this.$checkboxes = this.$root.querySelectorAll('input[type="checkbox"]')

    if (this.$countDisplay) {
      const singularLabel = this.$countDisplay.getAttribute('data-i18n-selected-count.one') || 'selected'
      const pluralLabel = this.$countDisplay.getAttribute('data-i18n-selected-count.other') || singularLabel

      this.i18n = new I18n({
        selectedCount: {
          one: `%{count} ${singularLabel} selected`,
          other: `%{count} ${pluralLabel} selected`
        }
      })

      this.setupEventListeners()
      this.updateCount()
    }
  }

  /**
   * Set up change event listeners on all checkboxes
   */
  setupEventListeners() {
    this.$checkboxes.forEach(($checkbox) => {
      $checkbox.addEventListener('change', () => this.updateCount())
    })
  }

  /**
   * Update the count display with the number of selected checkboxes
   */
  updateCount() {
    const checkedCount = this.$root.querySelectorAll(
      'input[type="checkbox"]:checked:not([data-select-all])'
    ).length

    this.$countDisplay.textContent = this.i18n.t('selectedCount', { count: checkedCount })
  }
}
