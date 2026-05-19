// This function can be used to sort a list of
// users by first name and then last name
const byName = function (a, b)  {
  const nameA = a.firstName.toUpperCase(); // ignore upper and lowercase
  const nameB = b.firstName.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

module.exports.byName = byName
