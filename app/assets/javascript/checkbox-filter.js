import { Component } from 'nhsuk-frontend'

/**
 * Checkbox Filter component
 *
 * Filters a list of checkboxes based on search input.
 *
 * Usage:
 * - Add `data-module="app-checkbox-filter"` to a search input element
 * - The component will filter `.nhsuk-checkboxes__item` elements within the same form
 * - Checkboxes with `data-select-all` attribute are not filtered
 *
 * @augments Component<HTMLInputElement>
 */
export class CheckboxFilter extends Component {
  static elementType = HTMLInputElement

  /**
   * Name for the component used when initialising using data-module attributes
   */
  static moduleName = 'app-checkbox-filter'

  /**
   * @param {Element | null} $root - HTML input element to use for component
   */
  constructor($root) {
    super($root)

    this.$form = this.$root.closest('form') || this.$root.closest('fieldset') || document.body
    this.$checkboxItems = this.$form.querySelectorAll('.nhsuk-checkboxes__item')

    this.$root.addEventListener('input', () => this.filter())
  }

  /**
   * Filter checkbox items based on the search input value
   */
  filter() {
    const searchTerm = this.$root.value.toLowerCase().trim().replace(/[.()]/g, '')
    const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0)

    this.$checkboxItems.forEach(($item) => {
      const $label = $item.querySelector('.nhsuk-checkboxes__label')
      const $checkbox = $item.querySelector('.nhsuk-checkboxes__input')

      if (!$label || !$checkbox) return

      // Skip if it's the select all checkbox
      if ($checkbox.hasAttribute('data-select-all')) return

      const labelText = $label.textContent.toLowerCase().replace(/[.()]/g, '')
      const labelWords = labelText.split(/\s+/)
      const matches = searchWords.length === 0 || searchWords.every(searchWord =>
        labelWords.some(labelWord => labelWord.startsWith(searchWord))
      )

      // Show only if matches search term
      if (matches) {
        $item.removeAttribute('hidden')
      } else {
        $item.setAttribute('hidden', '')
      }
    })
  }
}
