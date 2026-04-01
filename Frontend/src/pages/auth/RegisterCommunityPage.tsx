import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineShieldCheck, HiOutlineCheckCircle } from 'react-icons/hi2';
import { communityAPI } from '../../services/api';
import ThemeToggle from '../../components/common/ThemeToggle';
import toast from 'react-hot-toast';

const RegisterCommunityPage = () => {
  const [form, setForm] = useState({
    communityName: '',
    address: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await communityAPI.register(form);
      setSuccess(true);
      toast.success('Community registered!');
    } 
    catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } 
    finally {
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
          <h2 className="text-2xl font-bold mb-3">Community Registered!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your community is pending approval from the platform admin. You can log in with your admin credentials once approved.
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
          <h2 className="text-2xl font-bold mb-2">Register Community</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Set up your gated community on YourGate</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Community Name</label>
              <input
                type="text"
                value={form.communityName}
                onChange={(e) => setForm({ ...form, communityName: e.target.value })}
                className="input-field"
                placeholder="e.g. Green Valley Residency"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="input-field"
                placeholder="Full community address"
                required
              />
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Admin Account Details</p>

            <div>
              <label className="block text-sm font-medium mb-2">Admin Name</label>
              <input
                type="text"
                value={form.adminName}
                onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                className="input-field"
                placeholder="Admin full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Admin Email</label>
              <input
                type="email"
                value={form.adminEmail}
                onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                className="input-field"
                placeholder="admin@community.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Admin Password</label>
              <input
                type="password"
                value={form.adminPassword}
                onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                className="input-field"
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Registering...' : 'Register Community'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterCommunityPage;
