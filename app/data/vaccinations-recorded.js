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
  },
  {
    id: "54363532523",
    date: { day: "26", month: "11", year: "2025" },
    vaccine: "flu",
    vaccineProduct: "Adjuvanted Trivalent Influenza Vaccine (aTIV)",
    patient: {
      name: "Adele Purple",
      nhsNumber: "9951742954"
    },
    batchNumber: "634643636",
    batchExpiryDate: "2025-12-05",
    organisationId: "RWP", // Worcester Acure Hospitals NHS Trust
    siteId: "RWP01", // Alexandra Hospital
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Left arm",
    notes: "",
    editable: true
  },
  {
    id: "2522352352",
    date: { day: "26", month: "11", year: "2025" },
    vaccine: "flu",
    vaccineProduct: "Adjuvanted Trivalent Influenza Vaccine (aTIV)",
    patient: {
      name: "Adele Purple",
      nhsNumber: "9951742954"
    },
    batchNumber: "634643636",
    batchExpiryDate: "2025-12-05",
    organisationId: "RXX", // Surrey and Borders NHS Trust
    siteId: "RXX23", // The Meadows
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
    organisationId: "FT6X34", // MediCare Pharmacy
    siteId: "FB9012", // MediCare Pharmacy
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
    organisationId: "FX9141", // MediCare Pharmacy
    siteId: "FL9141", // MediCare Pharmacy
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Left arm",
    notes: "",
    editable: true
  },

  // Additional records below ensure every batch at Jane Smith's organisation
  // (Central Manchester Trust, RW3) has at least 2 vaccination records

  {
    id: "700001",
    date: { day: "24", month: "11", year: "2025" },
    vaccine: "COVID-19",
    vaccineProduct: "Comirnaty 3 LP.8.1",
    patient: {
      name: "Priya Patel",
      nhsNumber: "9111222333"
    },
    batchNumber: "8535345", // Batch AB2514
    batchExpiryDate: "2028-03-06",
    organisationId: "RW3", // Central Manchester Trust
    siteId: "RW3NM", // North Manchester General Hospital
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Right arm",
    notes: "",
    editable: true
  },
  {
    id: "700002",
    date: { day: "24", month: "11", year: "2025" },
    vaccine: "flu",
    vaccineProduct: "Adjuvanted Trivalent Influenza Vaccine (aTIV)",
    patient: {
      name: "Michael Osei",
      nhsNumber: "9111222334"
    },
    batchNumber: "634643636", // Batch 914-151
    batchExpiryDate: "2028-02-19",
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
    id: "700003",
    date: { day: "23", month: "11", year: "2025" },
    vaccine: "flu",
    vaccineProduct: "Adjuvanted Trivalent Influenza Vaccine (aTIV)",
    patient: {
      name: "Sarah Kowalski",
      nhsNumber: "9111222335"
    },
    batchNumber: "634643636", // Batch 914-151
    batchExpiryDate: "2028-02-19",
    organisationId: "RW3", // Central Manchester Trust
    siteId: "RW3NM", // North Manchester General Hospital
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Right arm",
    notes: "",
    editable: true
  },
  {
    id: "700004",
    date: { day: "22", month: "11", year: "2025" },
    vaccine: "COVID-19",
    vaccineProduct: "Comirnaty 3 LP.8.1",
    patient: {
      name: "Liam O'Connor",
      nhsNumber: "9111222336"
    },
    batchNumber: "343643636", // Batch NT2524
    batchExpiryDate: "2028-03-06",
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
    id: "700005",
    date: { day: "21", month: "11", year: "2025" },
    vaccine: "COVID-19",
    vaccineProduct: "Comirnaty 3 LP.8.1",
    patient: {
      name: "Grace Nakamura",
      nhsNumber: "9111222337"
    },
    batchNumber: "343643636", // Batch NT2524
    batchExpiryDate: "2028-03-06",
    organisationId: "RW3", // Central Manchester Trust
    siteId: "RW3HT", // Heaton Moor Health Centre
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Right arm",
    notes: "",
    editable: true
  },
  {
    id: "700006",
    date: { day: "20", month: "11", year: "2025" },
    vaccine: "pertussis",
    vaccineProduct: "Adacel vaccine suspension",
    patient: {
      name: "Daniel Wojcik",
      nhsNumber: "9111222338"
    },
    batchNumber: "46464363", // Batch M8-25-14
    batchExpiryDate: "2027-11-19",
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
    id: "700007",
    date: { day: "19", month: "11", year: "2025" },
    vaccine: "pertussis",
    vaccineProduct: "Adacel vaccine suspension",
    patient: {
      name: "Freya Thomsen",
      nhsNumber: "9111222339"
    },
    batchNumber: "46464363", // Batch M8-25-14
    batchExpiryDate: "2027-11-19",
    organisationId: "RW3", // Central Manchester Trust
    siteId: "RW3HT", // Heaton Moor Health Centre
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Right arm",
    notes: "",
    editable: true
  },
  {
    id: "700008",
    date: { day: "18", month: "11", year: "2025" },
    vaccine: "flu",
    vaccineProduct: "Adjuvanted Trivalent Influenza Vaccine (aTIV)",
    patient: {
      name: "Tomasz Nowak",
      nhsNumber: "9111222340"
    },
    batchNumber: "25523523", // Batch 194-151
    batchExpiryDate: "2027-12-04",
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
    id: "700009",
    date: { day: "17", month: "11", year: "2025" },
    vaccine: "flu",
    vaccineProduct: "Adjuvanted Trivalent Influenza Vaccine (aTIV)",
    patient: {
      name: "Amara Okafor",
      nhsNumber: "9111222341"
    },
    batchNumber: "25523523", // Batch 194-151
    batchExpiryDate: "2027-12-04",
    organisationId: "RW3", // Central Manchester Trust
    siteId: "RW3HT", // Heaton Moor Health Centre
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Right arm",
    notes: "",
    editable: true
  },
  {
    id: "700010",
    date: { day: "16", month: "11", year: "2025" },
    vaccine: "RSV",
    vaccineProduct: "Abrysvo",
    patient: {
      name: "Harold Fitzgerald",
      nhsNumber: "9111222342"
    },
    batchNumber: "46436346", // Batch ANEUEC-91
    batchExpiryDate: "2027-11-23",
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
    id: "700011",
    date: { day: "15", month: "11", year: "2025" },
    vaccine: "RSV",
    vaccineProduct: "Abrysvo",
    patient: {
      name: "Beatrice Lindqvist",
      nhsNumber: "9111222343"
    },
    batchNumber: "46436346", // Batch ANEUEC-91
    batchExpiryDate: "2027-11-23",
    organisationId: "RW3", // Central Manchester Trust
    siteId: "RW3HT", // Heaton Moor Health Centre
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Right arm",
    notes: "",
    editable: true
  },
  {
    id: "700012",
    date: { day: "14", month: "11", year: "2025" },
    vaccine: "COVID-19",
    vaccineProduct: "Comirnaty 3 LP.8.1",
    patient: {
      name: "Ellis Marsh",
      nhsNumber: "9111222344"
    },
    batchNumber: "325252145", // Batch PN8471
    batchExpiryDate: "2024-02-06",
    organisationId: "RW3", // Central Manchester Trust
    siteId: "RW07E", // Central Manchester Medical Centre
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Left arm",
    notes: "",
    editable: true
  },
  {
    id: "700013",
    date: { day: "13", month: "11", year: "2025" },
    vaccine: "COVID-19",
    vaccineProduct: "Comirnaty 3 LP.8.1",
    patient: {
      name: "Nadia Hussain",
      nhsNumber: "9111222345"
    },
    batchNumber: "325252145", // Batch PN8471
    batchExpiryDate: "2024-02-06",
    organisationId: "RW3", // Central Manchester Trust
    siteId: "RW07E", // Central Manchester Medical Centre
    vaccinatorId: "2387441662601", // Jane Smith
    eligibility: "Based on age",
    consent: "patient",
    injectionSite: "Right arm",
    notes: "",
    editable: true
  }
]

