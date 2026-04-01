import { useEffect, useState } from 'react';
import { HiOutlineUsers, HiOutlineBuildingOffice2, HiOutlineClipboardDocumentList, HiOutlineCalendarDays } from 'react-icons/hi2';
import { adminAPI, amenityAPI, visitorAPI, bookingAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ pending: 0, total: 0, amenities: 0, visitors: 0, bookings: 0 });

  useEffect(() => {
    Promise.all([
      adminAPI.getPendingUsers(),
      adminAPI.getUsers(),
      amenityAPI.getAll(),
      visitorAPI.getLogs(),
      bookingAPI.getCommunityBookings(),
    ]).then(([pending, users, amenities, visitors, bookings]) => {
      setStats({
        pending: pending.data.users.length,
        total: users.data.users.length,
        amenities: amenities.data.amenities.length,
        visitors: visitors.data.total || visitors.data.logs?.length || 0,
        bookings: bookings.data.bookings.length,
      });
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">Manage your community</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Pending Requests" count={stats.pending} icon={<HiOutlineUsers className="w-5 h-5" />} color="amber" />
        <StatCard label="Total Members" count={stats.total} icon={<HiOutlineUsers className="w-5 h-5" />} color="blue" />
        <StatCard label="Amenities" count={stats.amenities} icon={<HiOutlineBuildingOffice2 className="w-5 h-5" />} color="purple" />
        <StatCard label="Visitor Entries" count={stats.visitors} icon={<HiOutlineClipboardDocumentList className="w-5 h-5" />} color="green" />
        <StatCard label="Bookings" count={stats.bookings} icon={<HiOutlineCalendarDays className="w-5 h-5" />} color="primary" />
      </div>
    </div>
  );
};

export default AdminDashboard;
