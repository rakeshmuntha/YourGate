import { Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleTheme } from '../../store/slices/themeSlice';

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="relative w-8 h-8 rounded-full flex items-center justify-center
                 bg-[#F6F6F6] dark:bg-[#1C1C1C]
                 border border-[#E2E2E2] dark:border-[#2C2C2C]
                 text-[#545454] dark:text-[#9E9E9E]
                 hover:bg-[#EEEEEE] dark:hover:bg-[#242424]
                 hover:text-[#141414] dark:hover:text-[#EEEEEE]
                 transition-all duration-175
                 active:scale-[0.93]"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-[22px] h-[22px]" />
      ) : (
        <Moon className="w-[22px] h-[22px]" />
      )}
    </button>
  );
};

export default ThemeToggle;
