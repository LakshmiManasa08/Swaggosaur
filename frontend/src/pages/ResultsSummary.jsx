import React from 'react';
import DownloadButton from './DownloadButton';

const ResultsSummary = ({ results }) => {
  if (!results || results.length === 0) {
    return <p className="text-center text-gray-500">No test results available.</p>;
  }

  const total = results.length;
  const passed = results.filter(r => r.result === 'PASS').length;
  const failed = results.filter(r => r.result === 'FAIL').length;
  const warnings = results.filter(r => r.result === 'WARNING').length;
  const successRate = Math.round((passed / total) * 100);

  return (
    <div className="p-1 rounded-2xl bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-lg max-w-4xl mx-auto">
      <div className="p-6 bg-white rounded-xl space-y-6 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          ✨ Test Summary ✨
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="p-4 rounded-lg bg-green-50 shadow-sm">
            <p className="text-2xl md:text-3xl font-extrabold text-green-600">{passed}</p>
            <p className="text-gray-700 font-medium">Passed</p>
          </div>
          <div className="p-4 rounded-lg bg-red-50 shadow-sm">
            <p className="text-2xl md:text-3xl font-extrabold text-red-600">{failed}</p>
            <p className="text-gray-700 font-medium">Failed</p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-50 shadow-sm">
            <p className="text-2xl md:text-3xl font-extrabold text-yellow-600">{warnings}</p>
            <p className="text-gray-700 font-medium">Warnings</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 shadow-sm">
            <p className="text-2xl md:text-3xl font-extrabold text-blue-600">{total}</p>
            <p className="text-gray-700 font-medium">Total</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 shadow-sm">
            <p className="text-2xl md:text-3xl font-extrabold text-gray-700">{successRate}%</p>
            <p className="text-gray-700 font-medium">Success</p>
          </div>
        </div>

        <div className="flex justify-center">
          <DownloadButton
            content={JSON.stringify(results, null, 2)}
            filename="test-results.json"
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;
