const allOrganisations = require('./all-organisations')
const featureFlags = require('./feature-flags')
const organisations = require('./organisations')
const users = require('./users')
const vaccinationsRecorded = require('./vaccinations-recorded')
const vaccineStock = require('./vaccine-stock')
const vaccines = require('./vaccines')

module.exports = {
  organisations: organisations,
  allOrganisations: allOrganisations,
  featureFlags: featureFlags,
  users: users,
  vaccines: vaccines,
  vaccineStock: vaccineStock,
  lists: [],
  nhsNumberKnown: "yes",
  currentUserId: "6424325235325",
  currentOrganisationId: null,
  currentMode: "reports",
  vaccinationsRecorded: vaccinationsRecorded,

  // These are the options for extracting CSV reports
  patientDataOptions: ["Name", "NHS number", "Gender", "Date of birth", "Address", "Postcode", "ODS code of their GP"],
  staffDataOptions: ["Recorder", "Vaccinator"],
  locationDataOptions: ["Site name", "Site ODS code", "Location type"],
  consentAndEligibilityDataOptions: ["Consent", "Eligibility", "Estimated due date"],
  vaccinationDataOptions: ["Vaccine type", "Product", "Batch", "Batch expiry date", "Dose amount", "Vaccination site", "Vaccination date", "Comments"],
  paymentDataOptions: [
    {text: "Deposit ID", hint: "Set before we send the claim to NHSBSA"},
    {text: "Claim ID", hint: "Set when NHSBSA have received the claim"}
  ]

}
