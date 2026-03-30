import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineShieldCheck, HiOutlineEye, HiOutlineEyeSlash, HiOutlineCheckCircle } from 'react-icons/hi2';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="card max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <HiOutlineCheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Registration Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your account is pending approval from the community admin. You&apos;ll be able to log in once approved.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <HiOutlineShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-600">YourGate</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Join your community today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
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
              <label className="block text-sm font-medium mb-2">Email</label>
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
              <label className="block text-sm font-medium mb-2">Password</label>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
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
              <label className="block text-sm font-medium mb-2">Community</label>
              <select
                value={form.communityId}
                onChange={(e) => setForm({ ...form, communityId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select a community</option>
                {communities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.communityName}
                  </option>
                ))}
              </select>
            </div>

            {form.role === 'RESIDENT' && (
              <div>
                <label className="block text-sm font-medium mb-2">Flat / Unit Number</label>
                <input
                  type="text"
                  value={form.flatNumber}
                  onChange={(e) => setForm({ ...form, flatNumber: e.target.value })}
                  className="input-field"
                  placeholder="e.g. A-101"
                />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already registered?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
