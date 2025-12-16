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

  filters.dayName = function(isoDate) {
    const date = new Date(Date.parse(isoDate))
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {weekday: 'short'});

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

  /* keep the following line to return your filters to the app  */
  return filters
}

/**
 * @import { Environment } from 'nunjucks'
 */
