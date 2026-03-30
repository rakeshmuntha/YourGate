import { Link } from 'react-router-dom';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div className="card max-w-md w-full text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
        <HiOutlineExclamationTriangle className="w-10 h-10 text-amber-600" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/login" className="btn-primary inline-block">Go Home</Link>
    </div>
  </div>
);

export default NotFoundPage;
