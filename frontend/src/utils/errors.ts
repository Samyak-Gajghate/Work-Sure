import axios from 'axios';

export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    return (
      data?.error?.message ??
      data?.message ??
      err.message ??
      'Something went wrong'
    );
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}

// Alias for backward compatibility
export { extractErrorMessage as extractApiError };
