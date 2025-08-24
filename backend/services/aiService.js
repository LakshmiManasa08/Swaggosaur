const axios = require('axios');
const config = require('../config');

function extractEndpointsFromSwagger(specContent) {
  let spec;
  try {
    spec = JSON.parse(specContent);
  } catch (e) {
    throw new Error('Invalid Swagger spec format');
  }
  if (!spec.paths) throw new Error('No paths found in Swagger spec');

  let endpoints = [];
  let endpointCounter = 1;

  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method] of Object.entries(methods)) {
      endpoints.push({
        endpointNumber: endpointCounter,
        method: method.toUpperCase(),
        path
      });
      endpointCounter++;
    }
  }
  return endpoints;
}

function extractJsonArray(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1 || end < start) throw new Error('No JSON array found in AI response');
  const jsonStr = text.substring(start, end + 1);
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Failed to parse JSON array from AI response');
  }
}

async function generateTestCases(specContent, testType = 'comprehensive') {
  let endpoints = [];
  let baseUrl = '';

  try {
    // Parse Swagger spec
    const spec = JSON.parse(specContent);
    endpoints = extractEndpointsFromSwagger(specContent);

    // Extract base URL
    if (spec.servers?.length > 0) {
      baseUrl = spec.servers[0].url;
    } else if (spec.host) {
      const scheme = (spec.schemes?.[0]) || 'https';
      baseUrl = `${scheme}://${spec.host}${spec.basePath || ''}`;
    }

    // Replace placeholder URLs
    if (baseUrl?.includes('example.com') || baseUrl?.includes('placeholder.com') || baseUrl?.includes('mock.com')) {
      console.log('Detected placeholder URL:', baseUrl);
      baseUrl = 'https://jsonplaceholder.typicode.com';
      console.log('Replaced with working API:', baseUrl);
    }

    // If no endpoints found, return empty array early
    if (!endpoints.length) {
      console.warn('No endpoints found in Swagger spec');
      return [];
    }

  } catch (err) {
    console.error('Swagger parsing error:', err.message);
    return [];
  }

  // Build prompt dynamically
  const methodsWithBody = ['POST', 'PUT', 'PATCH'];
  const prompt = `
Generate structured API test cases in JSON format. Include dynamic requestBody for POST/PUT/PATCH.

Base URL: ${baseUrl}

Endpoints:
${endpoints.map(ep => `${ep.method} ${ep.path}`).join("\n")}

Requirements:
- Each endpoint object must have:
  "endpointNumber", "endpointName", "description", "testCases"
- Each testCase should have:
  "caseNumber", "type", "method", "endpoint", "expectedStatus", "description"
- Include "requestBody" only for POST/PUT/PATCH with realistic JSON data.
- Reset caseNumber to 1 for each endpoint.
- Return ONLY valid JSON array. No markdown or extra text.
`;

  try {
    const response = await axios.post(
      `${config.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: config.QWEN3_MODEL,
        messages: [
          { role: 'system', content: 'You are an expert API testing engineer. Return only JSON as requested.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 5000,
        temperature: 0.6,
        top_p: 0.9
      },
      {
        headers: { Authorization: `Bearer ${config.OPENROUTER_API_KEY}` },
        timeout: config.AI_TIMEOUT
      }
    );

    const aiText = response.data.choices?.[0]?.message?.content;
    if (!aiText) throw new Error('Empty AI response');

    // Parse AI JSON safely
    try {
      return extractJsonArray(aiText);
    } catch (parseErr) {
      console.error('AI raw output:', aiText);
      return [];
    }

  } catch (err) {
    console.error('AI API call failed:', err.message);
    return [];
  }
}

module.exports = { generateTestCases };
