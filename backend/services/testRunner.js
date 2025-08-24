const axios = require('axios');

function isFullUrl(url) {
  return /^https?:\/\//i.test(url);
}

// Map common endpoint paths to working API endpoints
function mapEndpointPath(endpoint, baseUrl) {
  if (!endpoint) return endpoint;

  // JSONPlaceholder mappings
  if (baseUrl.includes('jsonplaceholder.typicode.com')) {
    if (endpoint.includes('/users')) return endpoint.replace(/\/users(\/\d+)?$/, '/users$1');
    if (endpoint.includes('/posts')) return endpoint.replace(/\/posts(\/\d+)?$/, '/posts$1');
    if (endpoint.includes('/comments')) return endpoint.replace(/\/comments(\/\d+)?$/, '/comments$1');
    if (endpoint.includes('/albums')) return endpoint.replace(/\/albums(\/\d+)?$/, '/albums$1');
    if (endpoint.includes('/photos')) return endpoint.replace(/\/photos(\/\d+)?$/, '/photos$1');
    if (endpoint.includes('/todos')) return endpoint.replace(/\/todos(\/\d+)?$/, '/todos$1');
  }

  // DummyJSON mappings
  if (baseUrl.includes('dummyjson.com')) {
    if (endpoint.includes('/products')) return endpoint.replace(/\/products(\/\d+)?$/, '/products$1');
    if (endpoint.includes('/carts')) return endpoint.replace(/\/carts(\/\d+)?$/, '/carts$1');
    if (endpoint.includes('/users')) return endpoint.replace(/\/users(\/\d+)?$/, '/users$1');
    if (endpoint.includes('/posts')) return endpoint.replace(/\/posts(\/\d+)?$/, '/posts$1');
    if (endpoint.includes('/quotes')) return endpoint.replace(/\/quotes(\/\d+)?$/, '/quotes$1');
    if (endpoint.includes('/todos')) return endpoint.replace(/\/todos(\/\d+)?$/, '/todos$1');
  }

  return endpoint;
}

async function runTests(endpoints, baseUrl = '') {
  console.log('Running tests with base URL:', baseUrl);

  let results = [];

  for (const endpoint of endpoints) {
    console.log(`\n=== Endpoint ${endpoint.endpointNumber}: ${endpoint.endpointName} ===`);

    for (const tc of endpoint.testCases) {
      let actualStatus = null;
      let result = 'FAIL';
      let finalUrl = '';

      try {
        let url = tc.endpoint;

        if (!isFullUrl(url)) {
          if (baseUrl) {
            const mappedEndpoint = mapEndpointPath(url, baseUrl);
            finalUrl = baseUrl.replace(/\/$/, '') + '/' + mappedEndpoint.replace(/^\//, '');
          } else {
            actualStatus = 'ERROR';
            results.push({
              endpointNumber: endpoint.endpointNumber,
              endpointName: endpoint.endpointName,
              method: tc.method || 'GET',
              caseNumber: tc.caseNumber,
              type: tc.type || '',
              expectedStatus: tc.expectedStatus,
              actualStatus,
              result
            });
            continue;
          }
        } else {
          finalUrl = url;
        }

        console.log(`Running test case #${tc.caseNumber}: ${tc.method || 'GET'} ${finalUrl}`);

        const response = await axios({
          method: tc.method || 'get',
          url: finalUrl,
          data: tc.body || undefined,
          headers: tc.headers || undefined,
          validateStatus: () => true,
          timeout: 10000
        });

        actualStatus = response.status;
        if (actualStatus === tc.expectedStatus) {
          result = 'PASS';
        }
      } catch (e) {
        actualStatus = 'ERROR';
        console.error(`Test failed for ${tc.method || 'GET'} ${finalUrl}:`, e.message);
      }

      results.push({
        endpointNumber: endpoint.endpointNumber,
        endpointName: endpoint.endpointName,
        method: tc.method || 'GET',
        caseNumber: tc.caseNumber,
        type: tc.type || '',
        expectedStatus: tc.expectedStatus,
        actualStatus,
        result
      });
    }
  }

  return results;
}

module.exports = { runTests };
