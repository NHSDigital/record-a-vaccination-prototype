// Returns a date object from a valid year, month, and day.
// Note: inputs can be strings, and month is based on 1 = Jan
// rather than 0 = Jan
// Time is set to midday

/**
 * Returns a date object from a valid year, month, and day.
 *
 *  Note: inputs can be strings, and month is based on 1 = Jan
 * rather than 0 = Jan
 *
 * @param {String | Int} year - The year as a string or number
 * @param {String | Int} month - The month as a string or number
 * @param {String | Int} day - The day as a string or number
 * @returns {*} Either a valid Date object or null
 */
function dateFromYearMonthDay(year, month, day) {
  const yearInt = parseInt(year)
  const monthInt = parseInt(month)
  const dayInt = parseInt(day)

  if (yearInt > 0 && monthInt > 0 && dayInt > 0) {
    return new Date(yearInt, (monthInt - 1), dayInt, 12)
  } else {
    return null
  }
}

module.exports.dateFromYearMonthDay = dateFromYearMonthDay

