interface Props {
  label: string;
  count: number | string;
  icon: React.ReactNode;
  color?: string;
}

const StatCard = ({ label, count, icon, color = 'primary' }: Props) => {
  const colorMap: Record<string, string> = {
    primary: 'from-primary-500 to-primary-700',
    green: 'from-emerald-500 to-emerald-700',
    amber: 'from-amber-500 to-amber-700',
    red: 'from-red-500 to-red-700',
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-purple-700',
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-3xl font-bold mt-1">{count}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorMap[color] || colorMap.primary} flex items-center justify-center text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
