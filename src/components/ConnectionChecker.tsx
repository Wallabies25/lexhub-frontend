import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ApiError } from './ApiError';

interface ConnectionCheckerProps {
  children: React.ReactNode;
}

export function ConnectionChecker({ children }: ConnectionCheckerProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const checkConnection = async () => {
    try {
      await apiService.healthCheck();
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err : new Error('Connection failed'));
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (isConnected === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to backend...</p>
        </div>
      </div>
    );
  }

  if (!isConnected && error) {
    return <ApiError error={error} onRetry={checkConnection} />;
  }

  return <>{children}</>;
}
