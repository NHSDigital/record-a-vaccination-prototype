/**
 * Returns a random item from an array
 * @param {Array} array - The array to select from
 * @returns {*} A random item from the array, or null if array is empty/invalid
 */
function randomItem(array)
{
  // Handle invalid input
  if (!Array.isArray(array) || array.length === 0)
  {
    return null
  }

  // Generate random index and return the item
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

module.exports.randomItem = randomItem
