import { Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000000] px-4">
    <div className="card max-w-md w-full text-center py-12">
      <div className="w-16 h-16 mx-auto mb-5 bg-[#FFFBEB] dark:bg-[#F59E0B20] rounded-3xl flex items-center justify-center">
        <TriangleAlert className="w-8 h-8 text-[#D97706] dark:text-[#F59E0B]" />
      </div>
      <h2 className="text-2xl font-black text-[#141414] dark:text-[#EEEEEE] mb-2">Page Not Found</h2>
      <p className="text-sm text-[#8A8A8A] dark:text-[#616161] mb-7">The page you're looking for doesn't exist.</p>
      <Link to="/login" className="btn-primary inline-flex">Go Home</Link>
    </div>
  </div>
);

export default NotFoundPage;
