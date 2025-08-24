import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import EndpointsList from '../components/EndpointsList';
import TestCaseGenerator from '../components/TestCaseGenerator';
import TestResultsTable from '../components/TestResultsTable';
import DownloadButton from '../components/DownloadButton';
import StatsBanner from '../components/StatsBanner';
import { runTests } from '../api/api';

const UploadAgent = () => {
  // Holds the full swagger info: endpoints and swaggerFile
  const [swaggerInfo, setSwaggerInfo] = useState(null);
  const [testCases, setTestCases] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [runLoading, setRunLoading] = useState(false);
  const [runError, setRunError] = useState('');
  const [showTestCases, setShowTestCases] = useState(true);

  // Upload success handler - logs backend response and stores in state
  const handleUploadSuccess = (data) => {
    console.log('Upload response received in handleUploadSuccess:', data);
    setSwaggerInfo({
      success: data.success,
      endpoints: data.endpoints,
      swaggerFile: data.swaggerFile,
    });
    setTestCases('');
    setTestResults([]);
  };

  // Log current swaggerInfo on every render for debugging
  console.log('Current swaggerInfo state:', swaggerInfo);

  const handleTestCasesGenerated = (rawTestCases) => {
    let parsed;
    try {
      parsed = typeof rawTestCases === 'string' ? JSON.parse(rawTestCases) : rawTestCases;
      setTestCases(JSON.stringify(parsed, null, 2));
      setRunError('');
    } catch (e) {
      setTestCases(rawTestCases);
      setRunError('Test cases are not in a valid JSON format. Please check the AI output.');
    }
  };

  const handleRunTests = async () => {
    setRunError('');
    setRunLoading(true);
    try {
      let parsedTestCases = testCases;
      if (typeof testCases === 'string') {
        try {
          parsedTestCases = JSON.parse(testCases);
        } catch {
          setRunError('Test cases are not in a valid format for running.');
          setRunLoading(false);
          return;
        }
      }
      const response = await runTests(parsedTestCases, swaggerInfo?.swaggerFile);
      if (response.success) {
        setTestResults(response.results);
        setShowTestCases(false); // Hide test cases after successful test run
      } else {
        setRunError('Failed to run test cases.');
      }
    } catch (err) {
      setRunError('Error running test cases.');
      console.error('Error during runTests:', err);
    } finally {
      setRunLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UploadForm onUploadSuccess={handleUploadSuccess} />

        {swaggerInfo && swaggerInfo.endpoints && (
          <div className="mt-12 space-y-8">
            <EndpointsList endpoints={swaggerInfo.endpoints} />

            <TestCaseGenerator
              swaggerFile={swaggerInfo.swaggerFile}
              onTestCasesGenerated={handleTestCasesGenerated}
            />

            {testCases && showTestCases && (
              <div className="p-[2px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
                  {/* Decorative gradient glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 opacity-60 blur-2xl -z-10"></div>

                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Generated Test Cases
                    </h3>

                    {/* Fancy buttons container */}
                    <div className="flex space-x-4 bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-xl shadow-inner border border-purple-200">
                      <div className="transform transition hover:scale-105">
                        <DownloadButton content={testCases} filename="test-cases.md" />
                      </div>
                      <div className="transform transition hover:scale-105">
                        <button
                          onClick={handleRunTests}
                          disabled={runLoading}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {runLoading ? 'Running...' : 'Run Tests'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {runError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-red-600">{runError}</p>
                    </div>
                  )}

                  {/* 🔹 Scrollable test cases container */}
                  <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-lg text-gray-800">
                      {(() => {
                        try {
                          const parsedTestCases = JSON.parse(testCases);
                          return parsedTestCases.map((testCase, index) => (
                            <div key={index}>
                              <span className="font-bold">
                                Test Case #{index + 1} for Endpoint: {testCase.endpoint}
                              </span>
                              <br />
                              {JSON.stringify(testCase, null, 2)}
                            </div>
                          ));
                        } catch (e) {
                          console.error("Error parsing test cases for display:", e);
                          return testCases; // Fallback to raw string if parsing fails
                        }
                      })()}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {testResults.length > 0 && (
              <div className="space-y-8">
                <StatsBanner results={testResults} />
                {!showTestCases && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                      Generated Test Cases
                    </h3>
                    <button
                      onClick={() => setShowTestCases(true)}
                      className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Show Test Cases
                    </button>
                  </div>
                )}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Test Results
                  </h3>
                  <TestResultsTable results={testResults} />
                  <div className="mt-6">
                    <DownloadButton content={JSON.stringify(testResults, null, 2)} filename="test-results.json" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadAgent;
