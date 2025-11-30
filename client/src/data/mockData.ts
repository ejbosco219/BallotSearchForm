export interface BallotSheetItem {
  _id: string;
  nameprinted: string;
  registeredaddress: {
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface Voter {
  _id: string;
  firstName: string;
  lastName: string;
  address: {
    streetNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  voterId: string;
  partyAffiliation: string;
  status: string;
}

export const mockBallotSheets: BallotSheetItem[] = [
  {
    _id: "b1",
    nameprinted: "Alexandra Hamilton",
    registeredaddress: {
      streetNumber: "123",
      streetName: "Maple Avenue",
      city: "Springfield",
      state: "IL",
      zip: "62704"
    }
  },
  {
    _id: "b2",
    nameprinted: "Robert J. Smith",
    registeredaddress: {
      streetNumber: "45",
      streetName: "Oak Street",
      city: "Springfield",
      state: "IL",
      zip: "62704"
    }
  },
  {
    _id: "b3",
    nameprinted: "Maria Gonzalez",
    registeredaddress: {
      streetNumber: "789",
      streetName: "Pine Road",
      city: "Shelbyville",
      state: "IL",
      zip: "62565"
    }
  },
  {
    _id: "b4",
    nameprinted: "James K. Polk",
    registeredaddress: {
      streetNumber: "11",
      streetName: "Main St",
      city: "Springfield",
      state: "IL",
      zip: "62701"
    }
  }
];

export const mockVoters: Voter[] = [
  {
    _id: "v1",
    firstName: "Alexandra",
    lastName: "Hamilton",
    address: {
      streetNumber: "123",
      street: "Maple Avenue",
      city: "Springfield",
      state: "IL",
      zipCode: "62704"
    },
    voterId: "V10001",
    partyAffiliation: "Democrat",
    status: "Active"
  },
  {
    _id: "v2",
    firstName: "Alexander",
    lastName: "Hamilton",
    address: {
      streetNumber: "123",
      street: "Maple Ave",
      city: "Springfield",
      state: "IL",
      zipCode: "62704"
    },
    voterId: "V10002",
    partyAffiliation: "Independent",
    status: "Inactive"
  },
  {
    _id: "v3",
    firstName: "Alex",
    lastName: "Hammond",
    address: {
      streetNumber: "125",
      street: "Maple Avenue",
      city: "Springfield",
      state: "IL",
      zipCode: "62704"
    },
    voterId: "V10003",
    partyAffiliation: "Republican",
    status: "Active"
  },
  {
    _id: "v4",
    firstName: "Robert",
    lastName: "Smith",
    address: {
      streetNumber: "45",
      street: "Oak Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62704"
    },
    voterId: "V10004",
    partyAffiliation: "Democrat",
    status: "Active"
  },
  {
    _id: "v5",
    firstName: "Rob",
    lastName: "Smithson",
    address: {
      streetNumber: "450",
      street: "Oak Lane",
      city: "Springfield",
      state: "IL",
      zipCode: "62704"
    },
    voterId: "V10005",
    partyAffiliation: "Republican",
    status: "Active"
  },
  {
    _id: "v6",
    firstName: "Maria",
    lastName: "Gonzalez",
    address: {
      streetNumber: "789",
      street: "Pine Road",
      city: "Shelbyville",
      state: "IL",
      zipCode: "62565"
    },
    voterId: "V10006",
    partyAffiliation: "Independent",
    status: "Active"
  },
  {
    _id: "v7",
    firstName: "Mariana",
    lastName: "Goncalves",
    address: {
      streetNumber: "790",
      street: "Pine Rd",
      city: "Shelbyville",
      state: "IL",
      zipCode: "62565"
    },
    voterId: "V10007",
    partyAffiliation: "Democrat",
    status: "Active"
  },
  {
    _id: "v8",
    firstName: "James",
    lastName: "Polk",
    address: {
      streetNumber: "11",
      street: "Main St",
      city: "Springfield",
      state: "IL",
      zipCode: "62701"
    },
    voterId: "V10008",
    partyAffiliation: "Whig",
    status: "Historical"
  }
];
