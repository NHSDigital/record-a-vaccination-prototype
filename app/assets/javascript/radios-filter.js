import { Component } from 'nhsuk-frontend'

/**
 * Radios Filter component
 *
 * Filters a list of radio buttons based on search input.
 *
 * Usage:
 * - Add `data-module="app-radios-filter"` to a search input element
 * - The component will filter `.nhsuk-radios__item` elements within the same form or fieldset
 * - Radio items with `data-no-filter` on their input are not filtered (e.g. "add new" options)
 *
 * @augments Component<HTMLInputElement>
 */
export class RadiosFilter extends Component {
  static elementType = HTMLInputElement

  /**
   * Name for the component used when initialising using data-module attributes
   */
  static moduleName = 'app-radios-filter'

  /**
   * @param {Element | null} $root - HTML input element to use for component
   */
  constructor($root) {
    super($root)

    this.$form = this.$root.closest('fieldset') || this.$root.closest('form') || document.body
    this.$radioItems = this.$form.querySelectorAll('.nhsuk-radios__item')

    this.$root.addEventListener('input', () => this.filter())
  }

  /**
   * Filter radio items based on the search input value
   */
  filter() {
    const searchTerm = this.$root.value.toLowerCase().trim()
    const searchWords = searchTerm.split(/[\s.@()]+/).filter(word => word.length > 0)

    console.log('Filtering radios with search term:', searchTerm)

    console.log('Radio items:', this.$radioItems)

    this.$radioItems.forEach(($item) => {
      const $label = $item.querySelector('.nhsuk-radios__label')
      const $radio = $item.querySelector('.nhsuk-radios__input')

      if (!$label || !$radio) return

      // Skip items marked as excluded from filtering (e.g. "add new" options)
      if ($radio.hasAttribute('data-no-filter')) return

      const $hint = $item.querySelector('.nhsuk-radios__hint')
      const labelText = $label.textContent.toLowerCase()
      const hintText = $hint ? $hint.textContent.toLowerCase() : ''
      const combinedText = `${labelText} ${hintText}`
      const combinedWords = combinedText.split(/[\s.@()]+/).filter(word => word.length > 0)
      const matches = searchWords.length === 0 || searchWords.every(searchWord =>
        combinedWords.some(word => word.startsWith(searchWord))
      )

      if (matches) {
        $item.removeAttribute('hidden')
      } else {
        $item.setAttribute('hidden', '')
      }
    })
  }
}
