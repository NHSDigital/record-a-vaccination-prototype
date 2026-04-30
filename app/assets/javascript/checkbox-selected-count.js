import { ConfigurableComponent, I18n } from 'nhsuk-frontend'

/**
 * Checkbox Selected Count component
 *
 * Displays a count of selected checkboxes within a container with pluralization support.
 *
 * Usage:
 * - Add `data-module="app-checkboxes-count-select"` to a wrapper element
 * - Add an element with `data-selected-count-display` attribute to show the count
 * - Configure i18n via data attributes on the module element:
 *   `data-i18n.selected-count.one="%{count} pharmacy selected"`
 *   `data-i18n.selected-count.other="%{count} pharmacies selected"`
 * - Checkboxes with `data-select-all` attribute are excluded from the count
 *
 * @augments {ConfigurableComponent<CheckboxSelectedCountConfig>}
 */
export class CheckboxSelectedCount extends ConfigurableComponent {
  static elementType = HTMLElement

  /**
   * Name for the component used when initialising using data-module attributes
   */
  static moduleName = 'app-checkboxes-count-select'

  /**
   * @param {Element | null} $root - HTML element to use for component
   * @param {Partial<CheckboxSelectedCountConfig>} [config] - Component config
   */
  constructor($root, config = {}) {
    super($root, config)

    this.$countDisplay = this.$root.querySelector('[data-selected-count-display]')
    this.$checkboxes = this.$root.querySelectorAll('input[type="checkbox"]')

    this.i18n = new I18n(this.config.i18n)

    if (this.$countDisplay) {
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

  /**
   * Checkbox Selected Count default config
   *
   * @constant
   * @type {CheckboxSelectedCountConfig}
   */
  static defaults = Object.freeze({
    i18n: {
      selectedCount: {
        one: '%{count} selected',
        other: '%{count} selected'
      }
    }
  })

  /**
   * Checkbox Selected Count config schema
   *
   * @constant
   * @satisfies {Schema<CheckboxSelectedCountConfig>}
   */
  static schema = Object.freeze({
    properties: {
      i18n: { type: 'object' }
    }
  })
}

/**
 * Checkbox Selected Count config
 *
 * @typedef {object} CheckboxSelectedCountConfig
 * @property {CheckboxSelectedCountTranslations} [i18n] - Checkbox Selected Count translations
 */

/**
 * Checkbox Selected Count translations
 *
 * @typedef {object} CheckboxSelectedCountTranslations
 * @property {TranslationPluralForms} [selectedCount] - Count of selected checkboxes
 */

/**
 * @import { TranslationPluralForms } from 'nhsuk-frontend'
 * @import { Schema } from 'nhsuk-frontend/dist/nhsuk/common/configuration/index.mjs'
 */
