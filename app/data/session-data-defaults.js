const organisations = require('./organisations')
const allOrganisations = require('./all-organisations')
const regions = require('./regions')
const featureFlags = require('./feature-flags')
const users = require('./users')
const vaccines = require('./vaccines')

module.exports = {
  organisations: organisations,
  allOrganisations: allOrganisations,
  regions: regions,
  featureFlags: featureFlags,
  users: users,
  vaccines: vaccines,
  vaccineStock: [],
  lists: [],
  nhsNumberKnown: "yes",
  currentUserId: "2387441662601",
  currentOrganisationId: "RW3",
  currentRegionId: "Y62",
  vaccinationsRecorded: [],

  // These are the options for extracting CSV reports
  patientDataOptions: ["Name", "NHS number", "Gender", "Date of birth", "Address", "Postcode", "ODS code of their GP"],
  staffDataOptions: ["Recorder", "Vaccinator"],
  locationDataOptions: ["Site name", "Site ODS code", "Location type"],
  consentAndEligibilityDataOptions: ["Consent", "Eligibility", "Estimated due date"],
  vaccinationDataOptions: ["Vaccine type", "Product", "Batch", "Batch expiry date", "Dose amount", "Vaccination site", "Vaccination date", "Legal mechanism", "Comments"],

  legalMechanisms: [
    {
      value: "National protocol",
      text: "National protocol"
    },
    {
      value: "Patient group direction",
      text: "Patient group direction (PGD)"
    },
    {
      value: "Patient specific direction",
      text: "Patient specific direction (PSD)"
    },
    {
      value: "Written instruction",
      text: "Written instruction",
      hint: {
        text: "Occupational health only"
      }
    }
  ],
  careHomes: [
    {name: "Colin Care Home", code: "VL025", address1: "1 St James Street", town: "Manchester", postcode: "M1 63P"},
    {name: "Abacus Care Home", code: "VLA2K", address1: "30 Pleasant view gardens", town: "Leeds", postcode: "L8 1PD"},
    {name: "Barrington House", code: "VL55M", address1: "16 Mount Avon Drive", town: "London", postcode: "SE12 9PR"}
  ]
}
