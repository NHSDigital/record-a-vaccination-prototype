
async function getOrganisation(id) {
  const url = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/${id}`;

  console.log(url)

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch organisations: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  const organisation = {
    id: id,
    name: data?.Organisation?.Name,
    address: {
      line1: data?.Organisation?.GeoLoc?.Location?.AddrLn1,
      town: data?.Organisation?.GeoLoc?.Location?.Town,
      postcode: data?.Organisation?.GeoLoc?.Location?.PostCode
    }
  }

  return organisation;
}

/**
 * Fetches organisation data from the NHS ODS API
 * @param {string} id - The target organisation ID (e.g., 'P0MG')
 * @returns {Promise<string[]>} Array of OrgId values
 */
async function getPharmaciesBelongingToOrganisation(id) {
  const url = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?RelTypeId=RE6&TargetOrgId=${id}&Limit=1000`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch organisations: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  const pharmacies = (data.Organisations || []).map(function(org) {
    return {
      id: org.OrgId,
      name: org.Name,
      address: {
        postcode: org.PostCode
      }
    }
  });

  return pharmacies;
}

async function getPharmacyChains() {
  const url = `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=181&Status=Active&Limit=1000`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch organisations: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  const pharmacies = (data.Organisations || []).map(function(org) {
    return {
      id: org.OrgId,
      name: org.Name,
      address: {
        postcode: org.PostCode
      }
    }
  });

  console.log(pharmacies.length)

  return pharmacies;
}

module.exports = {
  getPharmaciesBelongingToOrganisation,
  getPharmacyChains,
  getOrganisation
};
