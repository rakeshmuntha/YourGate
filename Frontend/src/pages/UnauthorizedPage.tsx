import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000000] px-4">
    <div className="card max-w-md w-full text-center py-12">
      <div className="w-16 h-16 mx-auto mb-5 bg-[#FDEEEC] dark:bg-[#F4433620] rounded-3xl flex items-center justify-center">
        <ShieldAlert className="w-8 h-8 text-[#C0392B] dark:text-[#F44336]" />
      </div>
      <h2 className="text-2xl font-black text-[#141414] dark:text-[#EEEEEE] mb-2">Access Denied</h2>
      <p className="text-sm text-[#8A8A8A] dark:text-[#616161] mb-7">You don't have permission to access this page.</p>
      <Link to="/login" className="btn-primary inline-flex">Back to Login</Link>
    </div>
  </div>
);

export default UnauthorizedPage;
