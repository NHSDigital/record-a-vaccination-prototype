const prototypeFilters = require('@x-govuk/govuk-prototype-filters');


module.exports = function () {
  const filters = prototypeFilters;

  /**
   * Find an object by ID in an array
   *
   * @param {Array} array - Array to search
   * @param {string} id - ID to find
   * @returns {object} Found object or undefined
   */
  const findById = (array, id) => {
    if (!array || !Array.isArray(array)) return undefined
    return array.find(item => item.id === id)
  }

  filters.findById = findById

  filters.dayName = function(isoDate, style = 'short') {
    const date = new Date(Date.parse(isoDate))
    const weekdayStyle = (style === 'long') ? 'long' : 'short'
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {weekday: weekdayStyle});

    return dateFormatter.format(date)
  }

  filters.pluck = function(array, attribute) {
    return array.map((item) => item[attribute])
  }

  filters.capitaliseFirstLetter = function(string) {
    if (string) {
      return string.charAt(0) .toUpperCase() + string.slice(1)
    } else {
      return null
    }
  }

  filters.joinWithAnd = function(array) {
    if (!Array.isArray(array) || array.length === 0) {
      return ''
    }

    const items = array.map((item) => String(item))
    items[0] = filters.capitaliseFirstLetter(items[0])

    if (items.length === 1) {
      return items[0]
    }

    if (items.length === 2) {
      return `${items[0]} and ${items[1]}`
    }

    return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
  }

  /**
   * Returns the name of a month, eg 'November', when
   * given the number of the month, eg 11.
   *
   * Note that the month number should start from 1 for
   * January, rather than 0 (which is the default for
   * JavaScript date objects).
   *
   * @param {number|string} monthNumber - number of the month
   * @returns {string} Full name of the month in English
   */
  filters.monthName = function(monthNumber) {

    try {
      monthNumber = parseInt(monthNumber)

      if (!monthNumber || (monthNumber < 1) || (monthNumber > 12)) {
        throw new Error('Invalid monthNumber - must be between 1 and 12')
      }

      const date = new Date(Date.UTC(2000, (monthNumber - 1), 1, 0, 0, 0));
      const dateFormatter = new Intl.DateTimeFormat('en-GB', {month: 'long'});

      return dateFormatter.format(date)

    } catch (error) {
      return error.message.split(':')[0]
    }
  }

  /**
   * Calculate how long ago a date was
   *
   * @param {string|number|Date} date - Date to calculate from
   * @returns {string} Time ago in readable format (e.g. "2 days ago")
   */
  filters.timeAgo = function(date) {
    if (!date) return '—'
    
    const now = new Date()
    const inputDate = new Date(date)
    const diffInMs = now - inputDate
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInSeconds < 60) {
      return 'just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
    } else {
      return inputDate.toLocaleDateString('en-GB')
    }
  }

  /* keep the following line to return your filters to the app  */
  return filters
}

/**
 * @import { Environment } from 'nunjucks'
 */
