import { Component } from 'nhsuk-frontend'

/**
 * Add Another component
 *
 * Allows users to show/hide additional form sections with "Add another" and "Remove" buttons.
 * When an item is removed, subsequent items shift up to fill the gap.
 *
 * Progressive enhancement: Without JavaScript, all items are visible and buttons are hidden.
 * With JavaScript, empty items are hidden and buttons are shown as needed.
 *
 * Usage:
 * - Add `data-module="app-add-another"` to a container element
 * - Add `data-add-another-item="N"` to each item section (where N is the item index: 1, 2, 3, etc.)
 * - Add `data-add-another-add` to the "Add another" button (hidden by default)
 * - Add `data-add-another-remove="N"` to the "Remove" button within each section (hidden by default)
 *
 * @augments Component<HTMLElement>
 */
export class AddAnother extends Component {
  static elementType = HTMLElement

  /**
   * @param {Element | null} $root - HTML element to use for component
   */
  constructor($root) {
    super($root)

    this.$items = Array.from(this.$root.querySelectorAll('[data-add-another-item]'))
    this.$addButton = this.$root.querySelector('[data-add-another-add]')
    this.$addButtonWrapper = this.$addButton?.closest('.nhsuk-button-group')

    this.initializeItemVisibility()
    this.setupAddButton()
    this.setupRemoveButtons()
    this.updateAddButtonVisibility()
    this.updateRemoveButtonVisibility()
  }

  /**
   * Name for the component used when initialising using data-module attributes
   */
  static moduleName = 'app-add-another'

  /**
   * Check if an item has any input values
   *
   * @param {HTMLElement} $item - The item to check
   * @returns {boolean} True if item has any non-empty input values
   */
  hasInputValues($item) {
    const inputs = $item.querySelectorAll('input, textarea, select')
    return Array.from(inputs).some(($input) => {
      if ($input instanceof HTMLSelectElement) {
        return $input.selectedIndex > 0
      } else if ($input instanceof HTMLInputElement) {
        if ($input.type === 'checkbox' || $input.type === 'radio') {
          return $input.checked
        }
        return $input.value.trim() !== ''
      } else if ($input instanceof HTMLTextAreaElement) {
        return $input.value.trim() !== ''
      }
      return false
    })
  }

  /**
   * Initialize item visibility on page load
   * Shows items that have values, hides empty items after the last filled one
   */
  initializeItemVisibility() {
    // Find the last item with values
    let lastFilledIndex = 0
    this.$items.forEach(($item, index) => {
      if (this.hasInputValues($item)) {
        lastFilledIndex = index
      }
    })

    // Show items up to and including the last filled one (minimum 1)
    // Hide all items after that
    this.$items.forEach(($item, index) => {
      if (index <= lastFilledIndex) {
        $item.hidden = false
      } else {
        $item.hidden = true
      }
    })
  }

  /**
   * Get visible items
   */
  getVisibleItems() {
    return this.$items.filter($item => !$item.hidden)
  }

  /**
   * Get hidden items
   */
  getHiddenItems() {
    return this.$items.filter($item => $item.hidden)
  }

  /**
   * Set up the add another button
   */
  setupAddButton() {
    if (this.$addButton) {
      this.$addButton.addEventListener('click', (event) => {
        event.preventDefault()
        this.addItem()
      })
    }
  }

  /**
   * Set up remove buttons
   */
  setupRemoveButtons() {
    const removeButtons = this.$root.querySelectorAll('[data-add-another-remove]')

    removeButtons.forEach(($button) => {
      $button.addEventListener('click', (event) => {
        event.preventDefault()
        const index = parseInt($button.dataset.addAnotherRemove, 10)
        this.removeItem(index)
      })
    })
  }

  /**
   * Update visibility of add button based on number of hidden items
   * Show if there are items left to add, hide if all items are visible
   */
  updateAddButtonVisibility() {
    if (this.$addButtonWrapper) {
      const hiddenItems = this.getHiddenItems()
      this.$addButtonWrapper.hidden = hiddenItems.length === 0
    }
  }

  /**
   * Add the next item
   */
  addItem() {
    const hiddenItems = this.getHiddenItems()

    if (hiddenItems.length > 0) {
      hiddenItems[0].hidden = false
    }

    this.updateAddButtonVisibility()
    this.updateRemoveButtonVisibility()
  }

  /**
   * Remove an item and shift subsequent items up
   *
   * @param {number} index - The index of the item to remove (1, 2, 3, etc.)
   */
  removeItem(index) {
    const visibleItems = this.getVisibleItems()

    // Don't remove if only one item is visible
    if (visibleItems.length <= 1) {
      return
    }

    // Find items at and after the removed index
    const itemsToShift = visibleItems.filter($item => {
      const itemIndex = parseInt($item.dataset.addAnotherItem, 10)
      return itemIndex >= index
    })

    // Shift values from each subsequent item to the previous one
    for (let i = 0; i < itemsToShift.length - 1; i++) {
      this.copyInputValues(itemsToShift[i + 1], itemsToShift[i])
    }

    // Hide and clear the last visible item
    if (itemsToShift.length > 0) {
      const lastItem = itemsToShift[itemsToShift.length - 1]
      lastItem.hidden = true
      this.clearInputs(lastItem)
    }

    this.updateAddButtonVisibility()
    this.updateRemoveButtonVisibility()
  }

  /**
   * Update visibility of remove buttons based on number of visible items
   * Remove buttons should only be visible when there are 2+ items
   */
  updateRemoveButtonVisibility() {
    const visibleItems = this.getVisibleItems()
    const showRemoveButtons = visibleItems.length >= 2

    this.$items.forEach($item => {
      const $removeButton = $item.querySelector('[data-add-another-remove]')
      if ($removeButton) {
        const $buttonWrapper = $removeButton.parentElement
        if ($buttonWrapper) {
          $buttonWrapper.hidden = !showRemoveButtons
        }
      }
    })
  }

  /**
   * Copy input values from one element to another
   *
   * @param {HTMLElement} $source - The source element
   * @param {HTMLElement} $target - The target element
   */
  copyInputValues($source, $target) {
    const sourceInputs = $source.querySelectorAll('input, textarea, select')
    const targetInputs = $target.querySelectorAll('input, textarea, select')

    // Match inputs by their position (assumes same structure)
    sourceInputs.forEach(($sourceInput, i) => {
      const $targetInput = targetInputs[i]
      if ($targetInput) {
        if ($sourceInput instanceof HTMLSelectElement && $targetInput instanceof HTMLSelectElement) {
          $targetInput.selectedIndex = $sourceInput.selectedIndex
        } else if ($sourceInput instanceof HTMLInputElement && $targetInput instanceof HTMLInputElement) {
          if ($sourceInput.type === 'checkbox' || $sourceInput.type === 'radio') {
            $targetInput.checked = $sourceInput.checked
          } else {
            $targetInput.value = $sourceInput.value
          }
        } else if ($sourceInput instanceof HTMLTextAreaElement && $targetInput instanceof HTMLTextAreaElement) {
          $targetInput.value = $sourceInput.value
        }
      }
    })
  }

  /**
   * Clear all inputs within an element
   *
   * @param {HTMLElement} $element - The element containing inputs to clear
   */
  clearInputs($element) {
    const inputs = $element.querySelectorAll('input, textarea, select')

    inputs.forEach(($input) => {
      if ($input instanceof HTMLSelectElement) {
        $input.selectedIndex = 0
      } else if ($input instanceof HTMLInputElement) {
        if ($input.type === 'checkbox' || $input.type === 'radio') {
          $input.checked = false
        } else {
          $input.value = ''
        }
      } else if ($input instanceof HTMLTextAreaElement) {
        $input.value = ''
      }
    })
  }
}
