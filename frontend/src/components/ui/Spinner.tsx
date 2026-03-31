interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-3.5 h-3.5 border-[1.5px]',
  md: 'w-5 h-5 border-2',
  lg: 'w-7 h-7 border-2',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      className={`${sizeMap[size]} border-current border-t-transparent rounded-full animate-spin shrink-0 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" className="text-brand" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
