import React from 'react';

const EndpointsList = ({ endpoints }) => {
  if (!endpoints || endpoints.length === 0) {
    return (
      <div className="p-[2px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
          {/* Decorative gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 opacity-60 blur-2xl -z-10"></div>

          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Extracted Endpoints
          </h3>
          <p className="text-gray-600 text-lg">No endpoints extracted yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-[2px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative overflow-hidden">
        {/* Decorative gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 opacity-60 blur-2xl -z-10"></div>

        <h3 className="text-3xl font-bold text-gray-900 mb-6">
          Extracted Endpoints
        </h3>

        {/* 🔹 Scrollable area for endpoints */}
        <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-base font-bold text-gray-900">Method</th>
                <th className="px-6 py-4 text-base font-bold text-gray-900">Path</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {endpoints.map(({ method, path }, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${getMethodBorderClass(method)}`}
                    >
                      <span className={`${getMethodTextColorClass(method)} font-bold`}>
                        {method}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-base text-gray-900">{path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function getMethodBorderClass(method) {
  switch (method.toUpperCase()) {
    case 'GET': return 'border-green-600';
    case 'POST': return 'border-blue-600';
    case 'PUT': return 'border-yellow-600';
    case 'DELETE': return 'border-red-600';
    case 'PATCH': return 'border-purple-600';
    default: return 'border-gray-600';
  }
}

function getMethodTextColorClass(method) {
  switch (method.toUpperCase()) {
    case 'GET': return 'text-green-600';
    case 'POST': return 'text-blue-600';
    case 'PUT': return 'text-yellow-600';
    case 'DELETE': return 'text-red-600';
    case 'PATCH': return 'text-purple-600';
    default: return 'text-gray-600';
  }
}

export default EndpointsList;
