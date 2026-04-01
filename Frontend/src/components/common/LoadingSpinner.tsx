const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClass = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }[size];

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`${sizeClass} border-gray-200 dark:border-[#2a2a2a] border-t-gray-900 dark:border-t-white rounded-full animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;
