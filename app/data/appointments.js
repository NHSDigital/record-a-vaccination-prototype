// These are organisations set up as using RAVS
const day = 86400000 // number of milliseconds in a day
const toDateString = (offsetDays = 0) => (new Date(Date.now() + (offsetDays * day))).toISOString().substring(0,10)

const dayPlus2 = toDateString(2)
const dayPlus3 = toDateString(3)
const dayPlus4 = toDateString(4)
const dayPlus5 = toDateString(5)
const dayPlus6 = toDateString(6)
const dayPlus7 = toDateString(7)

module.exports = [

  {
    id: "163473464363",
    date: "today",
    time: "10:00",
    patient: {
      nhsNumber: "9123123123",
      firstName: "Alan",
      lastName: "Teapot",
      dateOfBirth: "1969-04-16",
      contactDetails: {
        mobile: "07588547704",
        phone: "0111432626",
        email: "alan.teapot@btinternet.com"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "923532535",
    date: "today",
    time: "10:30",
    patient: {
      nhsNumber: "9841414141",
      firstName: "Keith",
      lastName: "Napkin",
      dateOfBirth: "1976-02-12",
      contactDetails: {
        mobile: "077345813941"
      }
    },
    vaccinations: [
      "COVID-19",
      "flu"
    ]
  },
  {
    id: "2364364369",
    date: "today",
    time: "10:40",
    patient: {
      nhsNumber: "9841515715",
      firstName: "Lynn",
      lastName: "Feather",
      dateOfBirth: "1963-05-23",
      contactDetails: {
        email: "lynn.feather@gmail.com"
      }
    },
    vaccinations: [
      "COVID-19", "RSV"
    ]
  },
  {
    id: "3026352592",
    date: "today",
    time: "11:10",
    cancelled: {
      reason: "patient"
    },
    patient: {
      nhsNumber: "9835715151",
      firstName: "Lorna",
      lastName: "Biscuitbarrel",
      dateOfBirth: "1962-08-19",
      contactDetails: {
        mobile: "07364824944"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "410059235",
    date: "today",
    time: "11:20",
    patient: {
      nhsNumber: "9847471413",
      firstName: "Moira",
      lastName: "Packet",
      dateOfBirth: "1950-04-14",
      contactDetails: {
        mobile: "07623842424"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "5019581446",
    date: "today",
    time: "11:30",
    patient: {
      nhsNumber: "9841411411",
      firstName: "Cliff",
      lastName: "Sugarbowl",
      dateOfBirth: "1957-01-23",
      contactDetails: {
        mobile: "07623913141"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "69263464",
    date: "today",
    time: "11:40",
    patient: {
      nhsNumber: "9841411411",
      firstName: "James",
      lastName: "Brown",
      dateOfBirth: "1952-04-19",
      contactDetails: {
        mobile: "0723456123",
        email: "james.brown@hotmail.com"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "7692855825",
    date: "today",
    time: "11:50",
    patient: {
      nhsNumber: "9917425141",
      firstName: "Emma",
      lastName: "Blue",
      dateOfBirth: "1973-01-23",
      contactDetails: {
        mobile: "07524222525",
        email: "emma.blue123@nhs.net"
      }
    },
    vaccinations: [
      "COVID-19", "RSV"
    ]
  },
  {
    id: "8928558275",
    date: "today",
    time: "12:10",
    cancelled: {
      reason: "organisation"
    },
    patient: {
      nhsNumber: "9741851731",
      firstName: "Charlie",
      lastName: "Green",
      dateOfBirth: "1983-06-12",
      contactDetails: {
        email: "charlie.green@hotmail.com"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "9255253581",
    date: "today",
    time: "12:40",
    cancelled: {
      reason: "auto"
    },
    patient: {
      nhsNumber: "9951736814",
      firstName: "Jason",
      lastName: "White",
      dateOfBirth: "1998-03-19",
      contactDetails: {
        email: "jw225235@gmail.com"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "634633242",
    date: "yesterday",
    time: "11:20",
    patient: {
      nhsNumber: "9918571751",
      firstName: "Danny",
      lastName: "Green",
      dateOfBirth: "1998-03-19",
      contactDetails: {
        email: "dgreen@gmail.com"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "10363212525",
    date: "yesterday",
    time: "13:20",
    patient: {
      nhsNumber: "99472754141",
      firstName: "Jason",
      lastName: "Black",
      dateOfBirth: "1967-09-21",
      contactDetails: {
        email: "jblack@hotmail.com"
      }
    },
    vaccinations: [
      "flu"
    ],
    vaccinationIds: ["464743636"]
  },
  {
    id: "64639185885",
    date: "tomorrow",
    time: "08:55",
    patient: {
      nhsNumber: "9017474141",
      firstName: "Mohammed",
      lastName: "Khan",
      dateOfBirth: "1993-01-23",
      contactDetails: {
        email: "mk25325@gmail.com"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "64639185886",
    date: "tomorrow",
    time: "09:35",
    patient: {
      nhsNumber: "9017474142",
      firstName: "Priya",
      lastName: "Shaw",
      dateOfBirth: "1988-02-17",
      contactDetails: {
        email: "priya.shaw@gmail.com"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "64639185887",
    date: "tomorrow",
    time: "10:15",
    patient: {
      nhsNumber: "9017474143",
      firstName: "Rita",
      lastName: "Cooper",
      dateOfBirth: "1971-11-03",
      contactDetails: {
        mobile: "07444555111"
      }
    },
    vaccinations: [
      "RSV"
    ]
  },
  {
    id: "64639185888",
    date: "tomorrow",
    time: "11:05",
    patient: {
      nhsNumber: "9017474144",
      firstName: "Gary",
      lastName: "Turner",
      dateOfBirth: "1965-06-22",
      contactDetails: {
        email: "gary.turner@yahoo.co.uk"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "64639185889",
    date: "tomorrow",
    time: "13:15",
    patient: {
      nhsNumber: "9017474145",
      firstName: "Amina",
      lastName: "Farah",
      dateOfBirth: "1992-08-14",
      contactDetails: {
        mobile: "07500900100"
      }
    },
    vaccinations: [
      "COVID-19",
      "flu"
    ]
  },
  {
    id: "64639185890",
    date: "tomorrow",
    time: "15:00",
    patient: {
      nhsNumber: "9017474146",
      firstName: "Liam",
      lastName: "Osborne",
      dateOfBirth: "1980-04-01",
      contactDetails: {
        email: "liam.osborne@outlook.com"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "74639185891",
    date: dayPlus2,
    time: "09:05",
    patient: {
      nhsNumber: "9111000001",
      firstName: "Helen",
      lastName: "Bishop",
      dateOfBirth: "1964-09-19",
      contactDetails: {
        email: "helen.bishop@gmail.com"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "74639185892",
    date: dayPlus2,
    time: "09:50",
    patient: {
      nhsNumber: "9111000002",
      firstName: "Nina",
      lastName: "Ali",
      dateOfBirth: "1975-01-28",
      contactDetails: {
        mobile: "07900111222"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "74639185893",
    date: dayPlus2,
    time: "11:00",
    patient: {
      nhsNumber: "9111000003",
      firstName: "Sean",
      lastName: "Walsh",
      dateOfBirth: "1983-03-06",
      contactDetails: {
        email: "sean.walsh@hotmail.com"
      }
    },
    vaccinations: [
      "RSV"
    ]
  },
  {
    id: "74639185894",
    date: dayPlus2,
    time: "13:20",
    patient: {
      nhsNumber: "9111000004",
      firstName: "Monica",
      lastName: "Reed",
      dateOfBirth: "1959-12-11",
      contactDetails: {
        mobile: "07888123123"
      }
    },
    vaccinations: [
      "flu",
      "COVID-19"
    ]
  },
  {
    id: "74639185895",
    date: dayPlus2,
    time: "15:05",
    patient: {
      nhsNumber: "9111000005",
      firstName: "Patrick",
      lastName: "Moss",
      dateOfBirth: "1990-07-02",
      contactDetails: {
        email: "patrick.moss@nhs.net"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "74639185896",
    date: dayPlus3,
    time: "08:50",
    patient: {
      nhsNumber: "9111000006",
      firstName: "Deborah",
      lastName: "King",
      dateOfBirth: "1962-05-29",
      contactDetails: {
        email: "deborah.king@gmail.com"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "74639185897",
    date: dayPlus3,
    time: "09:40",
    patient: {
      nhsNumber: "9111000007",
      firstName: "Owen",
      lastName: "Price",
      dateOfBirth: "1986-10-12",
      contactDetails: {
        mobile: "07777123456"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "74639185898",
    date: dayPlus3,
    time: "10:55",
    patient: {
      nhsNumber: "9111000008",
      firstName: "Irene",
      lastName: "Stone",
      dateOfBirth: "1978-04-07",
      contactDetails: {
        email: "irene.stone@outlook.com"
      }
    },
    vaccinations: [
      "RSV"
    ]
  },
  {
    id: "74639185899",
    date: dayPlus3,
    time: "13:10",
    patient: {
      nhsNumber: "9111000009",
      firstName: "Calvin",
      lastName: "Dale",
      dateOfBirth: "1956-08-20",
      contactDetails: {
        mobile: "07666123456"
      }
    },
    vaccinations: [
      "flu",
      "COVID-19"
    ]
  },
  {
    id: "74639185900",
    date: dayPlus3,
    time: "14:45",
    patient: {
      nhsNumber: "9111000010",
      firstName: "Yasmin",
      lastName: "Cook",
      dateOfBirth: "1994-02-18",
      contactDetails: {
        email: "yasmin.cook@gmail.com"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "74639185901",
    date: dayPlus4,
    time: "09:15",
    patient: {
      nhsNumber: "9111000011",
      firstName: "Peter",
      lastName: "Lawrence",
      dateOfBirth: "1960-01-03",
      contactDetails: {
        email: "peter.lawrence@hotmail.com"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "74639185902",
    date: dayPlus4,
    time: "10:00",
    patient: {
      nhsNumber: "9111000012",
      firstName: "Sophie",
      lastName: "Tate",
      dateOfBirth: "1989-07-09",
      contactDetails: {
        mobile: "07700111000"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "74639185903",
    date: dayPlus4,
    time: "11:20",
    patient: {
      nhsNumber: "9111000013",
      firstName: "Harriet",
      lastName: "Nash",
      dateOfBirth: "1972-12-24",
      contactDetails: {
        email: "harriet.nash@gmail.com"
      }
    },
    vaccinations: [
      "RSV"
    ]
  },
  {
    id: "74639185904",
    date: dayPlus4,
    time: "13:30",
    patient: {
      nhsNumber: "9111000014",
      firstName: "Glen",
      lastName: "Hughes",
      dateOfBirth: "1954-03-31",
      contactDetails: {
        mobile: "07555111222"
      }
    },
    vaccinations: [
      "flu",
      "COVID-19"
    ]
  },
  {
    id: "74639185905",
    date: dayPlus4,
    time: "15:15",
    patient: {
      nhsNumber: "9111000015",
      firstName: "Adele",
      lastName: "Fox",
      dateOfBirth: "1996-10-05",
      contactDetails: {
        email: "adele.fox@nhs.net"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "74639185906",
    date: dayPlus5,
    time: "08:45",
    patient: {
      nhsNumber: "9111000016",
      firstName: "Megan",
      lastName: "Waters",
      dateOfBirth: "1968-06-16",
      contactDetails: {
        email: "megan.waters@yahoo.co.uk"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "74639185907",
    date: dayPlus5,
    time: "09:35",
    patient: {
      nhsNumber: "9111000017",
      firstName: "Idris",
      lastName: "Webb",
      dateOfBirth: "1981-09-27",
      contactDetails: {
        mobile: "07333111222"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "74639185908",
    date: dayPlus5,
    time: "10:50",
    patient: {
      nhsNumber: "9111000018",
      firstName: "Chloe",
      lastName: "Bennett",
      dateOfBirth: "1977-11-15",
      contactDetails: {
        email: "chloe.bennett@gmail.com"
      }
    },
    vaccinations: [
      "RSV"
    ]
  },
  {
    id: "74639185909",
    date: dayPlus5,
    time: "13:05",
    patient: {
      nhsNumber: "9111000019",
      firstName: "Dennis",
      lastName: "Ward",
      dateOfBirth: "1953-02-22",
      contactDetails: {
        mobile: "07444111999"
      }
    },
    vaccinations: [
      "flu",
      "COVID-19"
    ]
  },
  {
    id: "74639185910",
    date: dayPlus5,
    time: "14:55",
    patient: {
      nhsNumber: "9111000020",
      firstName: "Farah",
      lastName: "Iqbal",
      dateOfBirth: "1991-01-30",
      contactDetails: {
        email: "farah.iqbal@outlook.com"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "74639185911",
    date: dayPlus6,
    time: "09:10",
    patient: {
      nhsNumber: "9111000021",
      firstName: "Ronan",
      lastName: "Hall",
      dateOfBirth: "1961-04-25",
      contactDetails: {
        email: "ronan.hall@gmail.com"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "74639185912",
    date: dayPlus6,
    time: "10:05",
    patient: {
      nhsNumber: "9111000022",
      firstName: "Neha",
      lastName: "Patel",
      dateOfBirth: "1984-12-04",
      contactDetails: {
        mobile: "07766111999"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "74639185913",
    date: dayPlus6,
    time: "11:15",
    patient: {
      nhsNumber: "9111000023",
      firstName: "Elaine",
      lastName: "Curtis",
      dateOfBirth: "1970-08-09",
      contactDetails: {
        email: "elaine.curtis@hotmail.com"
      }
    },
    vaccinations: [
      "RSV"
    ]
  },
  {
    id: "74639185914",
    date: dayPlus6,
    time: "13:25",
    patient: {
      nhsNumber: "9111000024",
      firstName: "Trevor",
      lastName: "Knight",
      dateOfBirth: "1955-05-12",
      contactDetails: {
        mobile: "07888111888"
      }
    },
    vaccinations: [
      "flu",
      "COVID-19"
    ]
  },
  {
    id: "74639185915",
    date: dayPlus6,
    time: "15:00",
    patient: {
      nhsNumber: "9111000025",
      firstName: "Leah",
      lastName: "Mills",
      dateOfBirth: "1997-06-28",
      contactDetails: {
        email: "leah.mills@nhs.net"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "74639185916",
    date: dayPlus7,
    time: "09:00",
    patient: {
      nhsNumber: "9111000026",
      firstName: "Gita",
      lastName: "Singh",
      dateOfBirth: "1966-03-10",
      contactDetails: {
        email: "gita.singh@gmail.com"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  },
  {
    id: "74639185917",
    date: dayPlus7,
    time: "09:55",
    patient: {
      nhsNumber: "9111000027",
      firstName: "Marcus",
      lastName: "Ellis",
      dateOfBirth: "1982-07-21",
      contactDetails: {
        mobile: "07722111222"
      }
    },
    vaccinations: [
      "flu"
    ]
  },
  {
    id: "74639185918",
    date: dayPlus7,
    time: "11:05",
    patient: {
      nhsNumber: "9111000028",
      firstName: "Joy",
      lastName: "Baker",
      dateOfBirth: "1974-10-01",
      contactDetails: {
        email: "joy.baker@outlook.com"
      }
    },
    vaccinations: [
      "RSV"
    ]
  },
  {
    id: "74639185919",
    date: dayPlus7,
    time: "13:15",
    patient: {
      nhsNumber: "9111000029",
      firstName: "Ray",
      lastName: "Holland",
      dateOfBirth: "1958-09-14",
      contactDetails: {
        mobile: "07577111333"
      }
    },
    vaccinations: [
      "flu",
      "COVID-19"
    ]
  },
  {
    id: "74639185920",
    date: dayPlus7,
    time: "14:50",
    patient: {
      nhsNumber: "9111000030",
      firstName: "Holly",
      lastName: "Lane",
      dateOfBirth: "1995-11-26",
      contactDetails: {
        email: "holly.lane@gmail.com"
      }
    },
    vaccinations: [
      "COVID-19"
    ]
  }
]
