import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { loginUser } from '../../store/slices/authSlice';
import ThemeToggle from '../../components/common/ThemeToggle';
import toast from 'react-hot-toast';
import { Role } from '../../types';

// Inline gate SVG logo for the branding panel
const GateLogo = ({ size = 40, dark = false }: { size?: number; dark?: boolean }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
        >
            {/* Background (like first SVG) */}
            <rect
                width="24"
                height="24"
                rx="6"
                fill={dark ? "#FFFFFF" : "#141414"}
            />

            {/* Door outline */}
            <path
                d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"
                stroke={dark ? "#141414" : "white"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Bottom line */}
            <path
                d="M2 20h20"
                stroke={dark ? "#141414" : "white"}
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Door handle */}
            <circle
                cx="10"
                cy="12"
                r="1"
                fill={dark ? "#141414" : "white"}
            />
        </svg>
);

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
            toast.error((result.payload as string) || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-[#000000]">

            {/* ── Left branding panel ── */}
            <div className="hidden lg:flex lg:w-[44%] bg-[#000000] relative overflow-hidden flex-col">
                {/* Subtle noise texture overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#000000] to-[#000000]" />
                    {/* Ambient glow orbs */}
                    <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] bg-white/[0.025] rounded-full blur-3xl" />
                    <div className="absolute bottom-[10%] left-[-60px] w-[240px] h-[240px] bg-white/[0.015] rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col h-full px-12 py-12">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <GateLogo size={38} dark={false} />
                        <span className="text-[18px] font-black text-white tracking-[-0.025em]">YourGate</span>
                    </div>

                    {/* Main copy — vertically centered */}
                    <div className="flex-1 flex flex-col justify-center">
                        <h2 className="text-[3.25rem] font-black leading-[1.05] text-white tracking-[-0.035em] mb-5">
                            Your community,<br />
                            <span className="text-[#545454]">secured.</span>
                        </h2>
                        <p className="text-[#545454] text-[15px] leading-relaxed max-w-[280px]">
                            Visitors, amenities, access control, and real-time logs — all in one place.
                        </p>

                        {/* Feature dots */}
                        <div className="mt-10 flex flex-col gap-3">
                            {[
                                'Visitor access codes & QR',
                                'Amenity bookings',
                                'Security verification',
                                'Real-time entry logs',
                            ].map((f) => (
                                <div key={f} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#3C3C3C] flex-shrink-0" />
                                    <span className="text-sm text-[#616161]">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-[11px] text-[#2C2C2C] font-medium tracking-wide">
                        © 2026 YourGate
                    </p>
                </div>
            </div>

            {/* ── Right: Login form ── */}
            <div className="flex-1 flex flex-col bg-white dark:bg-[#000000]">
                {/* Top bar */}
                <div className="flex items-center justify-between px-6 py-5 lg:justify-end">
                    <div className="flex items-center gap-2.5 lg:hidden">
                        <GateLogo size={32} dark={false} />
                        <span className="text-[16px] font-black text-[#141414] dark:text-white tracking-[-0.02em]">
                            YourGate
                        </span>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Form area */}
                <div className="flex-1 flex items-center justify-center px-6 pb-12">
                    <div className="w-full max-w-[360px]">
                        <h2 className="text-[2rem] font-black text-[#141414] dark:text-[#EEEEEE] tracking-[-0.03em] mb-1">
                            Welcome back
                        </h2>
                        <p className="text-sm text-[#8A8A8A] dark:text-[#616161] mb-8">
                            Sign in to your account
                        </p>

                        {/* Error alert */}
                        {error && (
                            <div className="mb-6 flex items-start gap-3 p-4 bg-[#FDEEEC] dark:bg-[#F4433615] border border-[#F4B9B3] dark:border-[#F4433630] rounded-2xl">
                                <AlertCircle className="w-4 h-4 text-[#C0392B] dark:text-[#F44336] flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-[#C0392B] dark:text-[#F44336]">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2 tracking-[-0.005em]">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    placeholder="you@community.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2 tracking-[-0.005em]">
                                    Password
                                </label>
                                <div className="relative">
                                    <input style={{fontSize: "1.2rem", letterSpacing: "0.1em"}}
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field pr-12"
                                        placeholder="••••••••••"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADADAD] hover:text-[#545454] dark:hover:text-[#9E9E9E] transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword
                                            ? <EyeOff className="w-4.5 h-4.5" />
                                            : <Eye className="w-4.5 h-4.5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-1">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-[#276EF1]/30 border-t-[#276EF1] rounded-full animate-spin" />
                                            Signing in…
                                        </>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Footer links */}
                        <div className="mt-8 space-y-2.5 text-center">
                            <p className="text-sm text-[#8A8A8A] dark:text-[#616161]">
                                No account? &nbsp;
                                <Link
                                    to="/register"
                                    className="text-[#141414] dark:text-white font-semibold hover:underline underline-offset-2"
                                >
                                    Register
                                </Link>
                            </p>
                            <p className="text-sm text-[#8A8A8A] dark:text-[#616161]">
                                New community? &nbsp;
                                <Link
                                    to="/register-community"
                                    className="text-[#141414] dark:text-white font-semibold hover:underline underline-offset-2"
                                >
                                    Register community
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
