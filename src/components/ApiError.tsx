import React from 'react';

interface ApiErrorProps {
  error: Error;
  onRetry?: () => void;
}

export function ApiError({ error, onRetry }: ApiErrorProps) {
  const isConnectionError = error.message.includes('fetch') || error.message.includes('Failed to fetch');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          {isConnectionError ? 'Backend Connection Error' : 'API Error'}
        </h3>
        
        <p className="text-sm text-gray-600 text-center mb-4">
          {isConnectionError 
            ? 'Unable to connect to the backend server. Please ensure the backend is running on port 8080.'
            : error.message
          }
        </p>
        
        {isConnectionError && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <h4 className="text-sm font-medium text-blue-800 mb-1">To start the backend:</h4>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>1. Clone: <code className="bg-blue-100 px-1 rounded">git clone https://github.com/Wallabies25/lexhub-backend.git</code></li>
              <li>2. Switch to dev branch: <code className="bg-blue-100 px-1 rounded">git checkout dev</code></li>
              <li>3. Install dependencies and start the server</li>
            </ol>
          </div>
        )}
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
}
