// Error display components for better UX
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Search, Wifi, Server } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  variant?: 'inline' | 'card' | 'page';
  size?: 'sm' | 'md' | 'lg';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  variant = 'inline',
  size = 'md'
}) => {
  const getErrorIcon = (errorMessage: string) => {
    if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
      return <Wifi className="h-6 w-6 text-orange-500" />;
    }
    if (errorMessage.toLowerCase().includes('server') || errorMessage.toLowerCase().includes('500')) {
      return <Server className="h-6 w-6 text-red-500" />;
    }
    if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('404')) {
      return <Search className="h-6 w-6 text-blue-500" />;
    }
    return <AlertTriangle className="h-6 w-6 text-red-500" />;
  };

  const getErrorTitle = (errorMessage: string) => {
    if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
      return 'Connection Error';
    }
    if (errorMessage.toLowerCase().includes('server') || errorMessage.toLowerCase().includes('500')) {
      return 'Server Error';
    }
    if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('404')) {
      return 'Not Found';
    }
    return 'Error';
  };

  const sizeClasses = {
    sm: 'text-sm p-3',
    md: 'text-base p-4',
    lg: 'text-lg p-6'
  };

  if (variant === 'page') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-50 rounded-full w-fit">
              {getErrorIcon(error)}
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {getErrorTitle(error)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className={sizeClasses[size]}>
          <div className="flex items-center space-x-3">
            {getErrorIcon(error)}
            <div className="flex-1">
              <p className="font-medium text-red-900">{getErrorTitle(error)}</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            {onRetry && (
              <Button
                onClick={onRetry}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Inline variant
  return (
    <div className={`flex items-center space-x-3 text-red-600 bg-red-50 border border-red-200 rounded-lg ${sizeClasses[size]}`}>
      {getErrorIcon(error)}
      <div className="flex-1">
        <span className="font-medium">{getErrorTitle(error)}: </span>
        <span>{error}</span>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          size="sm"
          variant="ghost"
          className="text-red-600 hover:bg-red-100"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

// Specific error components for common scenarios
export const NetworkError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorDisplay
    error="Unable to connect to the server. Please check your internet connection."
    onRetry={onRetry}
    variant="card"
  />
);

export const NotFoundError: React.FC<{ resource?: string }> = ({ resource = 'resource' }) => (
  <ErrorDisplay
    error={`The ${resource} you're looking for doesn't exist or has been moved.`}
    variant="card"
  />
);

export const ServerError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorDisplay
    error="Our servers are experiencing issues. Please try again in a moment."
    onRetry={onRetry}
    variant="card"
  />
);

export const UnauthorizedError: React.FC = () => (
  <ErrorDisplay
    error="You need to sign in to access this feature."
    variant="card"
  />
);