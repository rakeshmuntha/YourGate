interface Props {
  label: string;
  count: number | string;
  icon: React.ReactNode;
  color?: 'primary' | 'green' | 'amber' | 'red' | 'blue' | 'purple';
}

const colorMap: Record<string, { bg: string; icon: string }> = {
  primary: {
    bg:   'bg-[#141414] dark:bg-white',
    icon: 'text-white dark:text-[#141414]',
  },
  green: {
    bg:   'bg-[#EAF7F0] dark:bg-[#06C16720]',
    icon: 'text-[#128B53] dark:text-[#06C167]',
  },
  amber: {
    bg:   'bg-[#FFFBEB] dark:bg-[#F59E0B20]',
    icon: 'text-[#D97706] dark:text-[#F59E0B]',
  },
  red: {
    bg:   'bg-[#FDEEEC] dark:bg-[#F4433620]',
    icon: 'text-[#C0392B] dark:text-[#F44336]',
  },
  blue: {
    bg:   'bg-[#EFF6FF] dark:bg-[#60A5FA20]',
    icon: 'text-[#1D4ED8] dark:text-[#60A5FA]',
  },
  purple: {
    bg:   'bg-[#F5F3FF] dark:bg-[#A78BFA20]',
    icon: 'text-[#6D28D9] dark:text-[#A78BFA]',
  },
};

const StatCard = ({ label, count, icon, color = 'primary' }: Props) => {
  const c = colorMap[color] ?? colorMap.primary;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl border border-[#E2E2E2] dark:border-[#242424] p-5 transition-colors duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-[0.07em] mb-2">
            {label}
          </p>
          <p className="text-[2rem] font-black text-[#141414] dark:text-[#EEEEEE] leading-none tracking-[-0.03em]">
            {count}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
          <span className={`[&>*]:w-5 [&>*]:h-5 ${c.icon}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
