import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  QrCode,
  CalendarDays,
  Users,
  Building2,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  MessageSquare,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { logoutUser } from '../../store/slices/authSlice';
import { Role } from '../../types';
import ThemeToggle from '../common/ThemeToggle';
import toast from 'react-hot-toast';

// Gate icon as a small inline SVG (lucide doesn't have a gate icon)
const GateIcon = ({ className }: { className?: string }) => (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-door-closed-icon lucide-door-closed"><path d="M10 12h.01"/><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/></svg>
);

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
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-175 select-none ${
      isActive
        ? 'bg-[#141414] dark:bg-white text-white dark:text-[#141414]'
        : 'text-[#545454] dark:text-[#9E9E9E] hover:bg-[#F6F6F6] dark:hover:bg-[#1C1C1C] hover:text-[#141414] dark:hover:text-[#EEEEEE]'
    }`;

  const initials = user?.name
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? '?';

  return (
    <div className="min-h-screen flex bg-[#F6F6F6] dark:bg-[#000000]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[240px] bg-white dark:bg-[#141414] border-r border-[#E2E2E2] dark:border-[#242424] flex flex-col transform transition-transform duration-225 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 border-b border-[#E2E2E2] dark:border-[#242424] flex-shrink-0" style={{ paddingTop: 'env(safe-area-inset-top)', minHeight: 'calc(4rem + env(safe-area-inset-top))' }}>
          <div className="flex items-center gap-2.5">
            {/* Gate logo mark */}
              <GateIcon className="w-4.5 h-4.5 text-white dark:text-[#141414]" />
            <div>
              <span className="text-[20px] font-bold text-[#141414] dark:text-[#EEEEEE] tracking-[-0.02em] leading-none">
                YourGate
              </span>
              <p className="text-[9px] font-semibold text-[#ADADAD] dark:text-[#616161] uppercase tracking-[0.1em] mt-0.5">
                Community
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#F6F6F6] dark:hover:bg-[#1C1C1C] text-[#8A8A8A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              end
              to={item.path}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 pb-4 pt-3 border-t border-[#E2E2E2] dark:border-[#242424] flex-shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#141414] dark:bg-white flex items-center justify-center text-white dark:text-[#141414] font-semibold text-xs flex-shrink-0 tracking-wide">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-[#141414] dark:text-[#EEEEEE] tracking-[-0.01em]">
                {user?.name}
              </p>
              <p className="text-[11px] text-[#8A8A8A] dark:text-[#616161] truncate capitalize">
                {user?.role?.toLowerCase().replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-[#C0392B] dark:text-[#F44336] hover:bg-[#FDEEEC] dark:hover:bg-[#F4433610] transition-colors duration-175"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#000000]/90 backdrop-blur-xl border-b border-[#E2E2E2] dark:border-[#242424] flex items-center px-4 lg:px-6 justify-between" style={{ paddingTop: 'env(safe-area-inset-top)', minHeight: 'calc(4rem + env(safe-area-inset-top))' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-[#F6F6F6] dark:hover:bg-[#1C1C1C] text-[#545454] dark:text-[#9E9E9E] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Desktop spacer */}
          <div className="hidden lg:block" />
          <ThemeToggle />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const iconCls = 'w-[18px] h-[18px] flex-shrink-0';

function getNavItems(role: Role) {
  if (role === Role.SUPER_ADMIN) {
    return [
      { path: '/super-admin',             label: 'Dashboard',   icon: <LayoutDashboard className={iconCls} /> },
      { path: '/super-admin/communities', label: 'Communities', icon: <Building2 className={iconCls} /> },
    ];
  }
  if (role === Role.ADMIN) {
    return [
      { path: '/admin',           label: 'Dashboard',    icon: <LayoutDashboard className={iconCls} /> },
      { path: '/admin/users',     label: 'Users',        icon: <Users className={iconCls} /> },
      { path: '/admin/amenities', label: 'Amenities',    icon: <Building2 className={iconCls} /> },
      { path: '/admin/bookings',  label: 'Bookings',     icon: <CalendarDays className={iconCls} /> },
      { path: '/admin/visitors',  label: 'Visitor Logs',     icon: <ClipboardList className={iconCls} /> },
      { path: '/admin/community-board', label: 'Community Board', icon: <MessageSquare className={iconCls} /> },
    ];
  }
  if (role === Role.RESIDENT) {
    return [
      { path: '/resident',               label: 'Dashboard',    icon: <LayoutDashboard className={iconCls} /> },
      { path: '/resident/access-codes',  label: 'Access Codes', icon: <QrCode className={iconCls} /> },
      { path: '/resident/amenities',     label: 'Amenities',    icon: <Building2 className={iconCls} /> },
      { path: '/resident/bookings',        label: 'My Bookings',    icon: <CalendarDays className={iconCls} /> },
      { path: '/resident/community-board', label: 'Community Board', icon: <MessageSquare className={iconCls} /> },
    ];
  }
  if (role === Role.SECURITY) {
    return [
      { path: '/security',          label: 'Dashboard',    icon: <LayoutDashboard className={iconCls} /> },
      { path: '/security/verify',   label: 'Verify Code',  icon: <ShieldCheck className={iconCls} /> },
      { path: '/security/visitors', label: 'Visitor Logs', icon: <ClipboardList className={iconCls} /> },
    ];
  }
  return [];
}

export default DashboardLayout;
