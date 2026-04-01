import { HiSun, HiMoon } from 'react-icons/hi2';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleTheme } from '../../store/slices/themeSlice';

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((s) => s.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] border border-transparent dark:border-[#2a2a2a] transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <HiSun className="w-4 h-4 text-amber-400" />
      ) : (
        <HiMoon className="w-4 h-4 text-gray-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
