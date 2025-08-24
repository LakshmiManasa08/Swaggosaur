import React from 'react';

const getAllKeys = (results) => {
  const keys = new Set();
  results.forEach(res => Object.keys(res).forEach(k => keys.add(k)));
  return Array.from(keys);
};

const TestResultsTable = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No test results available.</p>
      </div>
    );
  }
  
  const keys = getAllKeys(results);
  
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <div style={{ maxHeight: "320px", overflowY: "auto" }}>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              {keys.map(key => (
                <th key={key} className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((res, idx) => (
              <tr key={idx} className={`hover:bg-gray-50 transition-colors ${getResultRowClass(res.result)}`}>
                {keys.map(key => (
                  <td key={key} className="px-6 py-4 font-mono text-sm text-gray-900 break-all">
                    {typeof res[key] === 'object' ? JSON.stringify(res[key], null, 2) : String(res[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function getResultRowClass(result) {
  switch (result) {
    case 'PASS': return 'bg-green-50';
    case 'FAIL': return 'bg-red-50';
    case 'WARNING': return 'bg-yellow-50';
    default: return '';
  }
}

export default TestResultsTable;
