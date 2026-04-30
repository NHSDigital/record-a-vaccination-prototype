// ES6 or Vanilla JavaScript
import {
  createAll
} from 'nhsuk-frontend'

import { AddAnother } from './add-another.js'
import { Autocomplete } from './autocomplete.js'
import { CheckboxSelectedCount } from './checkbox-selected-count.js'

// Initiate NHS.UK frontend components on page load
document.addEventListener('DOMContentLoaded', () => {
  createAll(AddAnother)
  createAll(Autocomplete)
  createAll(CheckboxSelectedCount)
})


