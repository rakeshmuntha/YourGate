import { HiSun, HiMoon } from 'react-icons/hi2';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleTheme } from '../../store/slices/themeSlice';

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((s) => s.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <HiSun className="w-5 h-5 text-amber-400" />
      ) : (
        <HiMoon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
