import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000000] px-4">
        <div className="card max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#EAF7F0] dark:bg-[#06C16720] rounded-3xl flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#128B53] dark:text-[#06C167]" />
          </div>
          <h2 className="text-2xl font-black text-[#141414] dark:text-[#EEEEEE] mb-3">Community Registered!</h2>
          <p className="text-[#8A8A8A] dark:text-[#616161] mb-6">
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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000000] px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#141414] dark:bg-white rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-white dark:text-[#141414]"><rect x="2" y="11" width="4" height="11" rx="1"/><rect x="18" y="11" width="4" height="11" rx="1"/><path d="M2 12 Q2 4 12 4 Q22 4 22 12"/><circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none"/></svg>
            </div>
            <span className="text-[17px] font-black text-[#141414] dark:text-[#EEEEEE] tracking-[-0.02em]">YourGate</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="card">
          <h2 className="text-2xl font-black text-[#141414] dark:text-[#EEEEEE] mb-2">Register Community</h2>
          <p className="text-[#8A8A8A] dark:text-[#616161] mb-6">Set up your gated community on YourGate</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2">Community Name</label>
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
              <label className="block text-[13px] font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="input-field"
                placeholder="Full community address"
                required
              />
            </div>

            <hr className="border-[#E2E2E2] dark:border-[#242424]" />
            <p className="text-sm font-semibold text-[#545454] dark:text-[#9E9E9E]">Admin Account Details</p>

            <div>
              <label className="block text-[13px] font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2">Admin Name</label>
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
              <label className="block text-[13px] font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2">Admin Email</label>
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
              <label className="block text-[13px] font-semibold text-[#141414] dark:text-[#EEEEEE] mb-2">Admin Password</label>
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

          <p className="mt-6 text-center text-sm text-[#8A8A8A] dark:text-[#616161]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#141414] dark:text-white font-semibold hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterCommunityPage;
