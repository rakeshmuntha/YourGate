const LoadingSpinner = ({
  size = 'md',
  variant = 'spinner'
}: {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'progress-bar'
}) => {
  // Spinner variant (original spinning circle)
  if (variant === 'spinner') {
    const sizeClass = {
      sm: 'w-5 h-5 border-2',
      md: 'w-8 h-8 border-2',
      lg: 'w-12 h-12 border-3',
    }[size];

    return (
      <div className="flex items-center justify-center py-12">
        <div
          className={`${sizeClass} border-[#E2E2E2] dark:border-[#2C2C2C] border-t-[#276EF1] rounded-full animate-spin`}
        />
      </div>
    );
  }

  // Progress bar variant (Uber-style blue loading bar)
  return (
    <div className="w-full h-1 bg-[#EEEEEE] dark:bg-[#1C1C1C] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#276EF1] rounded-full"
        style={{
          animation: 'progress-bar 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
