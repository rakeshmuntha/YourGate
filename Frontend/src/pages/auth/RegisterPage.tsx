import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, DoorClosed } from 'lucide-react';
import { authAPI, communityAPI } from '../../services/api';
import ThemeToggle from '../../components/common/ThemeToggle';
import toast from 'react-hot-toast';
import { Community } from '../../types';

const RegisterPage = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'RESIDENT',
        flatNumber: '',
        communityId: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        communityAPI.getApproved().then((res) => setCommunities(res.data.communities));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.register(form);
            setSuccess(true);
            toast.success('Registration submitted!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000000] px-4">
                <div className="card max-w-sm w-full text-center py-10">
                    <div className="w-16 h-16 mx-auto mb-5 bg-[#EAF7F0] dark:bg-[#06C16720] rounded-3xl flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-[#128B53] dark:text-[#06C167]" />
                    </div>
                    <h2 className="text-2xl font-black text-[#141414] dark:text-[#EEEEEE] mb-2">Registration Submitted!</h2>
                    <p className="text-[#8A8A8A] text-sm mb-7">
                        Your account is pending approval from the community admin. You'll be able to log in once approved.
                    </p>
                    <button onClick={() => navigate('/login')} className="btn-primary text-sm">Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000000] px-4 py-12" style={{ paddingTop: 'calc(3rem + env(safe-area-inset-top))' }}>
            <div className="w-full max-w-md">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-[#141414] dark:bg-white rounded-xl flex items-center justify-center">
                            {/* <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-white dark:text-[#141414]"><rect x="2" y="11" width="4" height="11" rx="1"/><rect x="18" y="11" width="4" height="11" rx="1"/><path d="M2 12 Q2 4 12 4 Q22 4 22 12"/><circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none"/></svg> */}
                            <DoorClosed stroke='black'/>
                        </div>
                        <span className="text-lg font-black text-[#141414] dark:text-[#EEEEEE] tracking-[-0.02em]">YourGate</span>
                    </div>
                    <ThemeToggle />
                </div>

                <div className="card">
                    <h2 className="text-2xl font-black text-[#141414] dark:text-[#EEEEEE] mb-1">Create Account</h2>
                    <p className="text-[#8A8A8A] dark:text-[#616161] text-sm mb-6">Join your community today</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="input-field"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="input-field"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="input-field pr-12"
                                    placeholder="Min 6 characters"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8A8A] dark:text-[#616161] hover:text-[#545454] dark:hover:text-[#9E9E9E]"
                                >
                                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2">Role</label>
                            <select
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className="input-field"
                            >
                                <option value="RESIDENT">Resident</option>
                                <option value="SECURITY">Security Guard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2">Community</label>
                            <select
                                value={form.communityId}
                                onChange={(e) => setForm({ ...form, communityId: e.target.value })}
                                className="input-field"
                                required
                            >
                                <option value="">Select a community</option>
                                {communities.map((c) => (
                                    <option key={c._id} value={c._id}>{c.communityName}</option>
                                ))}
                            </select>
                        </div>
                        {form.role === 'RESIDENT' && (
                            <div>
                                <label className="block text-sm font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2">Flat / Unit Number</label>
                                <input
                                    type="text"
                                    value={form.flatNumber}
                                    onChange={(e) => setForm({ ...form, flatNumber: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g. A-101"
                                />
                            </div>
                        )}
                        <div className="pt-1">
                            <button type="submit" disabled={loading} className="btn-primary w-full text-sm">
                                {loading ? 'Submitting...' : 'Submit Registration'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-[#8A8A8A] dark:text-[#616161]">
                        Already registered?{' '}
                        <Link to="/login" className="text-[#141414] dark:text-[#EEEEEE] font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
