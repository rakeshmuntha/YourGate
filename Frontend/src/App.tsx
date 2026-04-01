import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import { fetchCurrentUser } from './store/slices/authSlice';
import { setTheme } from './store/slices/themeSlice';
import { Role } from './types';

import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RegisterCommunityPage from './pages/auth/RegisterCommunityPage';

// Resident pages
import ResidentDashboard from './pages/resident/ResidentDashboard';
import AccessCodesPage from './pages/resident/AccessCodesPage';
import ResidentAmenitiesPage from './pages/resident/ResidentAmenitiesPage';
import ResidentBookingsPage from './pages/resident/ResidentBookingsPage';

// Security pages
import SecurityDashboard from './pages/security/SecurityDashboard';
import VerifyCodePage from './pages/security/VerifyCodePage';
import SecurityVisitorLogs from './pages/security/SecurityVisitorLogs';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageAmenitiesPage from './pages/admin/ManageAmenitiesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminVisitorLogs from './pages/admin/AdminVisitorLogs';

// Shared pages
import CommunityBoardPage from './pages/shared/CommunityBoardPage';

// Super Admin pages
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import CommunitiesPage from './pages/superadmin/CommunitiesPage';

// Error pages
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
    const dispatch = useAppDispatch();
    const { isLoading, isAuthenticated, user } = useAppSelector((s) => s.auth);
    const { theme } = useAppSelector((s) => s.theme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        dispatch(setTheme(theme));
    }, [theme, dispatch]);

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-400 text-sm font-medium">Loading YourGate...</p>
                </div>
            </div>
        );
    }

    const getDefaultRoute = () => {
        if (!isAuthenticated || !user) return '/login';
        const map: Record<string, string> = {
            [Role.SUPER_ADMIN]: '/super-admin',
            [Role.ADMIN]: '/admin',
            [Role.RESIDENT]: '/resident',
            [Role.SECURITY]: '/security',
        };
        return map[user.role] || '/login';
    };

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register-community" element={<RegisterCommunityPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Resident routes */}
            <Route
                element={
                    <ProtectedRoute allowedRoles={[Role.RESIDENT]}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/resident" element={<ResidentDashboard />} />
                <Route path="/resident/access-codes" element={<AccessCodesPage />} />
                <Route path="/resident/amenities" element={<ResidentAmenitiesPage />} />
                <Route path="/resident/bookings" element={<ResidentBookingsPage />} />
                <Route path="/resident/community-board" element={<CommunityBoardPage />} />
            </Route>

            {/* Security routes */}
            <Route
                element={
                    <ProtectedRoute allowedRoles={[Role.SECURITY]}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/security" element={<SecurityDashboard />} />
                <Route path="/security/verify" element={<VerifyCodePage />} />
                <Route path="/security/visitors" element={<SecurityVisitorLogs />} />
            </Route>

            {/* Admin routes */}
            <Route
                element={
                    <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<ManageUsersPage />} />
                <Route path="/admin/amenities" element={<ManageAmenitiesPage />} />
                <Route path="/admin/bookings" element={<AdminBookingsPage />} />
                <Route path="/admin/visitors" element={<AdminVisitorLogs />} />
                <Route path="/admin/community-board" element={<CommunityBoardPage />} />
            </Route>

            {/* Super Admin routes */}
            <Route
                element={
                    <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/super-admin" element={<SuperAdminDashboard />} />
                <Route path="/super-admin/communities" element={<CommunitiesPage />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to={getDefaultRoute()} />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default App;
