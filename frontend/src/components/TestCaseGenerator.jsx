import React, { useState } from 'react';
import { generateTestCases } from '../api/api';
import LoadingSpinner from './LoadingSpinner';
import { SparklesIcon } from '@heroicons/react/24/outline';

const TestCaseGenerator = ({ swaggerFile, onTestCasesGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    if (!swaggerFile || typeof swaggerFile !== 'object') {
      setError('No valid Swagger/OpenAPI spec available. Please upload or load a valid spec first.');
      console.error('swaggerFile is missing or invalid:', swaggerFile);
      return;
    }

    setLoading(true);
    try {
      console.log('Swagger file sent to generateTestCases:', swaggerFile);
      const response = await generateTestCases(swaggerFile);
      if (response.success) {
        onTestCasesGenerated(response.testCases);
      } else {
        setError('Failed to generate test cases');
      }
    } catch (err) {
      setError('Error generating test cases');
      console.error('Error during generateTestCases:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-[2px] shadow-xl">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 animate-fade-in">
        
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-indigo-500" />
            Generate Test Cases
          </h3>
          <button
            onClick={handleGenerate}
            disabled={loading || !swaggerFile}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold 
              hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Generating...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 mr-2 text-yellow-300 animate-pulse" />
                Generate Test Cases
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-shake">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <p className="text-gray-600 text-base leading-relaxed">
          Generate <span className="font-semibold text-indigo-600">comprehensive test cases</span> 
          for your API endpoints using <span className="italic">AI-powered intelligence</span>.
        </p>
      </div>
    </div>
  );
};

export default TestCaseGenerator;
