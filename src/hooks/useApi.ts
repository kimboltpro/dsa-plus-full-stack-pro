// Custom hooks for API operations with loading and error states
import { useState, useEffect, useCallback } from 'react';
import { APIError, ApiResponse } from '@/lib/api';

// Generic hook for API calls with loading and error states
export function useApiCall<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('API call failed:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading };
}

// Hook for mutations (POST, PUT, DELETE operations)
export function useApiMutation<T, P = any>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (apiFunction: (params: P) => Promise<T>, params: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(params);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('API mutation failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, mutate, reset };
}

// Hook for paginated data
export function usePaginatedApi<T>(
  apiFunction: (page: number, limit: number) => Promise<T[]>,
  limit: number = 20
) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(pageNum, limit);
      
      if (reset) {
        setData(result);
      } else {
        setData(prev => [...prev, ...result]);
      }
      
      setHasMore(result.length === limit);
      setPage(pageNum);
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Paginated API call failed:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchData(page + 1, false);
    }
  }, [fetchData, loading, hasMore, page]);

  const refresh = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    fetchData(1, true);
  }, [fetchData]);

  useEffect(() => {
    fetchData(1, true);
  }, [fetchData]);

  return { 
    data, 
    error, 
    loading, 
    hasMore, 
    loadMore, 
    refresh 
  };
}

// Hook for real-time data with WebSocket-like updates
export function useRealTimeData<T>(
  tableName: string,
  initialApiCall: () => Promise<T[]>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await initialApiCall();
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof APIError 
            ? err.message 
            : 'An unexpected error occurred';
          setError(errorMessage);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, error, loading };
}