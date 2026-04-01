interface Props {
  label: string;
  count: number | string;
  icon: React.ReactNode;
  color?: string;
}

const StatCard = ({ label, count, icon, color = 'primary' }: Props) => {
  const colorMap: Record<string, string> = {
    primary: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900',
    green: 'bg-emerald-500 text-white',
    amber: 'bg-amber-500 text-white',
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    purple: 'bg-purple-500 text-white',
  };

  return (
    <div className="card hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{count}</p>
        </div>
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colorMap[color] || colorMap.primary}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
