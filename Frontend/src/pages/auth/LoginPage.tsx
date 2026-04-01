import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineShieldCheck, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { loginUser } from '../../store/slices/authSlice';
import ThemeToggle from '../../components/common/ThemeToggle';
import toast from 'react-hot-toast';
import { Role } from '../../types';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((s) => s.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(result)) {
            toast.success('Welcome back!');
            const role = result.payload.role;
            const routes: Record<string, string> = {
                [Role.SUPER_ADMIN]: '/super-admin',
                [Role.ADMIN]: '/admin',
                [Role.RESIDENT]: '/resident',
                [Role.SECURITY]: '/security',
            };
            navigate(routes[role] || '/');
        } else {
            toast.error(result.payload as string || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-[#0a0a0a]">
            {/* Left: Branding panel — true black like Uber */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#0a0a0a] relative overflow-hidden">
                {/* Subtle texture */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#000000]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl" />
                    <div className="absolute top-1/3 right-0 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col justify-between px-14 py-14 text-white w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <HiOutlineShieldCheck className="w-6 h-6 text-gray-900" />
                        </div>
                        <span className="text-xl font-black tracking-tight">YourGate</span>
                    </div>

                    {/* Main copy */}
                    <div>
                        <h2 className="text-5xl font-black leading-[1.1] mb-5 tracking-tight">
                            Your community,<br />
                            <span className="text-gray-400">secured.</span>
                        </h2>
                        <p className="text-gray-400 text-base leading-relaxed max-w-xs">
                            Manage visitors, amenities, bookings, and security from one powerful platform.
                        </p>
                        <div className="mt-10 grid grid-cols-2 gap-3">
                            {['Visitor Management', 'Amenity Booking', 'Access Control', 'Real-time Logs'].map((f) => (
                                <div key={f} className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-gray-700">© 2026 YourGate</p>
                </div>
            </div>

            {/* Right: Login form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-[#0a0a0a]">
                <div className="w-full max-w-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div className="lg:hidden flex items-center gap-2">
                            <div className="w-9 h-9 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
                                <HiOutlineShieldCheck className="w-5 h-5 text-white dark:text-gray-900" />
                            </div>
                            <span className="text-lg font-black text-gray-900 dark:text-white">YourGate</span>
                        </div>
                        <ThemeToggle />
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">Welcome back</h2>
                    <p className="text-gray-400 dark:text-gray-500 mb-8 text-sm">Sign in to continue</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="pt-1">
                            <button type="submit" disabled={isLoading} className="btn-primary w-full text-sm">
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 space-y-2 text-center">
                        <p className="text-sm text-gray-400">
                            No account?{' '}
                            <Link to="/register" className="text-gray-900 dark:text-white font-semibold hover:underline">
                                Register here
                            </Link>
                        </p>
                        <p className="text-sm text-gray-400">
                            New community?{' '}
                            <Link to="/register-community" className="text-gray-900 dark:text-white font-semibold hover:underline">
                                Register Community
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
