const prototypeFilters = require('@x-govuk/govuk-prototype-filters');

const dateFromYearMonthDay = require('./lib/utils/date-from-year-month-day');


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

  filters.vaccinationsForPatient = function(records, nhsNumber) {
    if (!Array.isArray(records)) return []

    return records
      .map((record, index) => ({ record, index }))
      .filter(({ record }) => {
        return record && record.patient && record.patient.nhsNumber === nhsNumber
      })
      .sort((a, b) => {
        const dateA = dateFromYearMonthDay(a.record.date.year, a.record.date.month, a.record.date.day)
        const dateB = dateFromYearMonthDay(b.record.date.year, b.record.date.month, b.record.date.day)

        if (dateA && dateB && dateA.getTime() !== dateB.getTime()) {
          return dateB.getTime() - dateA.getTime()
        }

        return b.index - a.index
      })
      .map(({ record }) => record)
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

  /**
   * Ensure a value is always returned as an array
   * Useful for form fields with [] notation that may return a string if only one value
   *
   * @param {string|Array|null|undefined} value - Value to convert to array
   * @returns {Array} Value as an array
   */
  filters.asArray = function(value) {
    if (value === undefined || value === null) {
      return []
    }
    if (Array.isArray(value)) {
      return value
    }
    return [value]
  }

  filters.daysSince = function(dateValue) {
    if (!dateValue) return null

    const inviteDate = new Date(dateValue)
    if (Number.isNaN(inviteDate.getTime())) return null

    const now = new Date()
    const inviteDay = new Date(inviteDate.getFullYear(), inviteDate.getMonth(), inviteDate.getDate())
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const millisecondsPerDay = 24 * 60 * 60 * 1000
    return Math.floor((today - inviteDay) / millisecondsPerDay)
  }

  /* keep the following line to return your filters to the app  */
  return filters
}

/**
 * @import { Environment } from 'nunjucks'
 */
