import { Link } from 'react-router-dom';
import { HiOutlineShieldExclamation } from 'react-icons/hi2';

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div className="card max-w-md w-full text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <HiOutlineShieldExclamation className="w-10 h-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">You don&apos;t have permission to access this page.</p>
      <Link to="/login" className="btn-primary inline-block">Back to Login</Link>
    </div>
  </div>
);

export default UnauthorizedPage;
