import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineQrCode,
  HiOutlineCalendarDays,
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
  HiOutlineClipboardDocumentList,
  HiOutlineShieldCheck,
  HiOutlineArrowRightOnRectangle,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { logoutUser } from '../../store/slices/authSlice';
import { Role } from '../../types';
import ThemeToggle from '../common/ThemeToggle';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out');
    navigate('/login');
  };

  const navItems = getNavItems(user?.role as Role);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#222] hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#111111] border-r border-gray-100 dark:border-[#1e1e1e] transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-[#1e1e1e]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
                <HiOutlineShieldCheck className="w-5 h-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h1 className="text-base font-black text-gray-900 dark:text-white tracking-tight">
                  YourGate
                </h1>
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest">
                  Community
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#222] text-gray-400"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                end
                to={item.path}
                className={linkClass}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User info + Logout */}
          <div className="p-4 border-t border-gray-100 dark:border-[#1e1e1e]">
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="w-9 h-9 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-100 dark:border-[#1e1e1e]">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-600 dark:text-gray-400"
            >
              <HiBars3 className="w-5 h-5" />
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function getNavItems(role: Role) {
  const items = [];

  if (role === Role.SUPER_ADMIN) {
    items.push(
      { path: '/super-admin', label: 'Dashboard', icon: <HiOutlineHome className="w-4.5 h-4.5" /> },
      { path: '/super-admin/communities', label: 'Communities', icon: <HiOutlineBuildingOffice2 className="w-4.5 h-4.5" /> }
    );
  }

  if (role === Role.ADMIN) {
    items.push(
      { path: '/admin', label: 'Dashboard', icon: <HiOutlineHome className="w-4.5 h-4.5" /> },
      { path: '/admin/users', label: 'Manage Users', icon: <HiOutlineUsers className="w-4.5 h-4.5" /> },
      { path: '/admin/amenities', label: 'Amenities', icon: <HiOutlineBuildingOffice2 className="w-4.5 h-4.5" /> },
      { path: '/admin/bookings', label: 'Bookings', icon: <HiOutlineCalendarDays className="w-4.5 h-4.5" /> },
      { path: '/admin/visitors', label: 'Visitor Logs', icon: <HiOutlineClipboardDocumentList className="w-4.5 h-4.5" /> }
    );
  }

  if (role === Role.RESIDENT) {
    items.push(
      { path: '/resident', label: 'Dashboard', icon: <HiOutlineHome className="w-4.5 h-4.5" /> },
      { path: '/resident/access-codes', label: 'Access Codes', icon: <HiOutlineQrCode className="w-4.5 h-4.5" /> },
      { path: '/resident/amenities', label: 'Amenities', icon: <HiOutlineBuildingOffice2 className="w-4.5 h-4.5" /> },
      { path: '/resident/bookings', label: 'My Bookings', icon: <HiOutlineCalendarDays className="w-4.5 h-4.5" /> }
    );
  }

  if (role === Role.SECURITY) {
    items.push(
      { path: '/security', label: 'Dashboard', icon: <HiOutlineHome className="w-4.5 h-4.5" /> },
      { path: '/security/verify', label: 'Verify Code', icon: <HiOutlineShieldCheck className="w-4.5 h-4.5" /> },
      { path: '/security/visitors', label: 'Visitor Logs', icon: <HiOutlineClipboardDocumentList className="w-4.5 h-4.5" /> }
    );
  }

  return items;
}

export default DashboardLayout;
