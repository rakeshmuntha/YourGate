import { useEffect, useState } from 'react';
import { Users, Building2, ClipboardList, CalendarDays } from 'lucide-react';
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
        <h1 className="text-3xl font-black text-[#141414] dark:text-[#EEEEEE] tracking-[-0.025em]">Dashboard</h1>
        <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">Manage your community</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Pending Requests" count={stats.pending} icon={<Users />} color="amber" />
        <StatCard label="Total Members" count={stats.total} icon={<Users />} color="blue" />
        <StatCard label="Amenities" count={stats.amenities} icon={<Building2 />} color="purple" />
        <StatCard label="Visitor Entries" count={stats.visitors} icon={<ClipboardList />} color="green" />
        <StatCard label="Bookings" count={stats.bookings} icon={<CalendarDays />} color="primary" />
      </div>
    </div>
  );
};

export default AdminDashboard;
