// Vaccinations recorded
//
// This is used to set up some initial examples
// of vaccinations already recorded
module.exports = [
  {
    id: "655516",
    date: { day: "28", month: "11", year: "2025" },
    vaccine: "COVID-19",
    vaccineProduct: "Comirnaty 3 LP.8.1",
    patient: {
      name: "Jodie Brown",
      nhsNumber: "9123123123"
    },
    batchNumber: "8535345",
    batchExpiryDate: "2025-12-05",
    organisationId: "RW3", // Central Manchester Trust
    siteId: "RW3NM", // North Manchester General Hospital
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Left arm",
    notes: "",
    editable: true
  },
  {
    id: "4643643",
    date: { day: "26", month: "11", year: "2025" },
    vaccine: "flu",
    vaccineProduct: "Adjuvanted Trivalent Influenza Vaccine (aTIV)",
    patient: {
      name: "Ade Green",
      nhsNumber: "9983742954"
    },
    batchNumber: "634643636",
    batchExpiryDate: "2025-12-05",
    organisationId: "RW3", // Central Manchester Trust
    siteId: "RW3HT", // Heaton Moor Health Centre
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Left arm",
    notes: "",
    editable: true
  },
  {
    id: "464743636",
    date: { day: "26", month: "11", year: "2025" },
    vaccine: "flu",
    vaccineProduct: "Adjuvanted Trivalent Influenza Vaccine (aTIV)",
    patient: {
      name: "Adele Purple",
      nhsNumber: "9951742954"
    },
    batchNumber: "634643636",
    batchExpiryDate: "2025-12-05",
    organisationId: "FA424", // Pickfords Pharmacy
    siteId: "343252356", // Pickfords Pharmacy
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Left arm",
    notes: "",
    editable: true
  }

]

