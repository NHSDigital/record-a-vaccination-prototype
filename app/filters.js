
const prototypeFilters = require('@x-govuk/govuk-prototype-filters');

module.exports = function (env) { /* eslint-disable-line no-unused-vars */
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = prototypeFilters;

  /**
   * Find an object by ID in an array
   * @param {Array} array - Array to search
   * @param {string} id - ID to find
   * @returns {Object} Found object or undefined
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
    return string.charAt(0) .toUpperCase() + string.slice(1)
  }

  /**
   * Returns the name of a month, eg 'November', when
   * given the number of the month, eg 11.
   *
   * Note that the month number should start from 1 for
   * January, rather than 0 (which is the default for
   * JavaScript date objects).
   *
   * @param {Integer, string} monthNumber - number of the month
   * @returns {String} Full name of the month in English
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

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters;
};
