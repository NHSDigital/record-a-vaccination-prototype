import { Component } from 'nhsuk-frontend'

/**
 * Checkbox Select All component
 *
 * Provides select all functionality for a group of checkboxes.
 *
 * Usage:
 * - Add `data-module="app-checkbox-select-all"` to a checkbox input element
 * - The component will control all other checkboxes in the same form/fieldset
 * - The select-all checkbox shows indeterminate state when some (but not all) are checked
 *
 * @augments Component<HTMLInputElement>
 */
export class CheckboxSelectAll extends Component {
  static elementType = HTMLInputElement

  /**
   * Name for the component used when initialising using data-module attributes
   */
  static moduleName = 'app-checkbox-select-all'

  /**
   * @param {Element | null} $root - HTML input element to use for component
   */
  constructor($root) {
    super($root)

    this.$form = this.$root.closest('form') || this.$root.closest('fieldset') || document.body

    // All checkboxes except this one
    this.$checkboxes = Array.from(
      this.$form.querySelectorAll('input[type="checkbox"]')
    ).filter(($checkbox) => $checkbox !== this.$root)

    // Click on select-all toggles all checkboxes
    this.$root.addEventListener('change', () => this.toggleAll())

    // Click on individual checkboxes updates select-all state
    this.$checkboxes.forEach(($checkbox) => {
      $checkbox.addEventListener('change', () => this.updateState())
    })

    // Set initial state
    this.updateState()
  }

  /**
   * Toggle all checkboxes to match the select-all checkbox state
   */
  toggleAll() {
    this.$checkboxes.forEach(($checkbox) => {
      $checkbox.checked = this.$root.checked
    })
  }

  /**
   * Update the select-all checkbox state based on individual checkbox states
   */
  updateState() {
    const allChecked = this.$checkboxes.every(($checkbox) => $checkbox.checked)
    const noneChecked = this.$checkboxes.every(($checkbox) => !$checkbox.checked)

    this.$root.checked = allChecked
    this.$root.indeterminate = !allChecked && !noneChecked
  }
}
