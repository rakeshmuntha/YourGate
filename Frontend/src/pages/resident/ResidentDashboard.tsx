import { useEffect, useState } from 'react';
import { HiOutlineQrCode, HiOutlineCalendarDays, HiOutlineTicket } from 'react-icons/hi2';
import { accessCodeAPI, bookingAPI } from '../../services/api';
import { useAppSelector } from '../../hooks/useRedux';
import StatCard from '../../components/common/StatCard';
import { AccessCode, Booking } from '../../types';

const ResidentDashboard = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    accessCodeAPI.getMyCodes().then((r) => setCodes(r.data.codes));
    bookingAPI.getMyBookings().then((r) => setBookings(r.data.bookings));
  }, []);

  const activeCodes = codes.filter((c) => c.status === 'ACTIVE');
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name?.split(' ')[0]}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here&apos;s your community overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard label="Active Codes" count={activeCodes.length} icon={<HiOutlineQrCode className="w-6 h-6" />} color="blue" />
        <StatCard label="Total Codes" count={codes.length} icon={<HiOutlineTicket className="w-6 h-6" />} color="purple" />
        <StatCard label="Active Bookings" count={confirmedBookings.length} icon={<HiOutlineCalendarDays className="w-6 h-6" />} color="green" />
      </div>

      {/* Recent codes */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Access Codes</h2>
        {codes.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">No access codes generated yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Code</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Usage</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Expires</th>
                </tr>
              </thead>
              <tbody>
                {codes.slice(0, 5).map((code) => (
                  <tr key={code._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-2 font-mono font-semibold">{code.code}</td>
                    <td className="py-3 px-2">
                      <span className={code.type === 'GUEST' ? 'badge-active' : 'badge-pending'}>{code.type}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={code.status === 'ACTIVE' ? 'badge-approved' : 'badge-expired'}>{code.status}</span>
                    </td>
                    <td className="py-3 px-2">{code.usedCount}/{code.usageLimit}</td>
                    <td className="py-3 px-2 text-gray-500">{new Date(code.expiresAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentDashboard;
