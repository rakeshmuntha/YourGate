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
        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/25">
                <HiOutlineShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  YourGate
                </h1>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  Community Manager
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
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
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <HiBars3 className="w-6 h-6" />
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
      { path: '/super-admin', label: 'Dashboard', icon: <HiOutlineHome className="w-5 h-5" /> },
      { path: '/super-admin/communities', label: 'Communities', icon: <HiOutlineBuildingOffice2 className="w-5 h-5" /> }
    );
  }

  if (role === Role.ADMIN) {
    items.push(
      { path: '/admin', label: 'Dashboard', icon: <HiOutlineHome className="w-5 h-5" /> },
      { path: '/admin/users', label: 'Manage Users', icon: <HiOutlineUsers className="w-5 h-5" /> },
      { path: '/admin/amenities', label: 'Amenities', icon: <HiOutlineBuildingOffice2 className="w-5 h-5" /> },
      { path: '/admin/bookings', label: 'Bookings', icon: <HiOutlineCalendarDays className="w-5 h-5" /> },
      { path: '/admin/visitors', label: 'Visitor Logs', icon: <HiOutlineClipboardDocumentList className="w-5 h-5" /> }
    );
  }

  if (role === Role.RESIDENT) {
    items.push(
      { path: '/resident', label: 'Dashboard', icon: <HiOutlineHome className="w-5 h-5" /> },
      { path: '/resident/access-codes', label: 'Access Codes', icon: <HiOutlineQrCode className="w-5 h-5" /> },
      { path: '/resident/amenities', label: 'Amenities', icon: <HiOutlineBuildingOffice2 className="w-5 h-5" /> },
      { path: '/resident/bookings', label: 'My Bookings', icon: <HiOutlineCalendarDays className="w-5 h-5" /> }
    );
  }

  if (role === Role.SECURITY) {
    items.push(
      { path: '/security', label: 'Dashboard', icon: <HiOutlineHome className="w-5 h-5" /> },
      { path: '/security/verify', label: 'Verify Code', icon: <HiOutlineShieldCheck className="w-5 h-5" /> },
      { path: '/security/visitors', label: 'Visitor Logs', icon: <HiOutlineClipboardDocumentList className="w-5 h-5" /> }
    );
  }

  return items;
}

export default DashboardLayout;
