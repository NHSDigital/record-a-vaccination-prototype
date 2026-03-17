
// There are 2 different ODS APIs, the old ORD API and the newer FHIR-based API.
// The ORD API is officially deprecated and may be retired in the future.
const BASE_ORD_URL = 'https://directory.spineservices.nhs.uk/ORD/2-0-0';
const BASE_FHIR_URL = 'https://sandbox.api.service.nhs.uk/organisation-data-terminology-api/fhir'

/**
 * Helper function to fetch paginated organisations from the ODS API
 * @param {string} queryParams - Query parameters (without Limit/Offset)
 * @returns {Promise<Object[]>} Array of organisation objects
 */
async function fetchPaginatedOrganisations(queryParams) {
  const limit = 1000;
  let offset = 0;
  let allResults = [];
  let hasMore = true;

  while (hasMore) {
    let url = `${BASE_ORD_URL}/organisations?${queryParams}&Limit=${limit}`;
    if (offset > 0) {
      url += `&Offset=${offset}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch organisations: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const results = (data.Organisations || []).map(function(org) {
      return {
        id: org.OrgId,
        name: org.Name,
        address: {
          postcode: org.PostCode
        }
      }
    });

    allResults = allResults.concat(results);

    if (results.length < limit) {
      hasMore = false;
    } else {
      offset += limit;
    }
  }

  return allResults;
}

/**
 * Fetches organisation data from the NHS ODS API
 * @param {string} id - The target organisation ID (e.g., 'P0MG')
 * @returns {Promise<Object[]>} Array of pharmacy objects
 */
async function getPharmaciesBelongingToOrganisation(id) {
  return fetchPaginatedOrganisations(`RelTypeId=RE6&TargetOrgId=${id}`);
}

async function getPharmacyChains() {
  return fetchPaginatedOrganisations('PrimaryRoleId=181&Status=Active');
}

async function getOrganisation(id) {
  const url = `${BASE_FHIR_URL}/Organization/${id}`;

  const response = await fetch(url, {
    headers: {
      'apikey': process.env.ODS_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch organisation: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  const organisation = {
    id: data.id,
    name: data.name,
    address: {
      line1: data.address[0].line[0],
      town: data.address[0].city,
      postcode: data.address[0].postalCode
    }
  }

  return organisation;
}

module.exports = {
  getPharmaciesBelongingToOrganisation,
  getPharmacyChains,
  getOrganisation
};
