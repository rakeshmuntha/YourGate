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
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Hi, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Here's your community overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Active Codes" count={activeCodes.length} icon={<HiOutlineQrCode className="w-5 h-5" />} color="blue" />
        <StatCard label="Total Codes" count={codes.length} icon={<HiOutlineTicket className="w-5 h-5" />} color="purple" />
        <StatCard label="Active Bookings" count={confirmedBookings.length} icon={<HiOutlineCalendarDays className="w-5 h-5" />} color="green" />
      </div>

      {/* Recent Access Codes */}
      <div className="card">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Recent Access Codes</h2>
        {codes.length === 0 ? (
          <div className="py-8 text-center">
            <HiOutlineQrCode className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-sm text-gray-400">No access codes generated yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#2a2a2a]">
                  <th className="text-left pb-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Code</th>
                  <th className="text-left pb-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="text-left pb-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left pb-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usage</th>
                  <th className="text-left pb-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#1e1e1e]">
                {codes.slice(0, 5).map((code) => (
                  <tr key={code._id}>
                    <td className="py-3 px-2 font-mono font-bold text-gray-900 dark:text-white text-sm tracking-widest">{code.code}</td>
                    <td className="py-3 px-2">
                      <span className={code.type === 'GUEST' ? 'badge-active' : 'badge-pending'}>{code.type}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={code.status === 'ACTIVE' ? 'badge-approved' : 'badge-expired'}>{code.status}</span>
                    </td>
                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400 text-xs">{code.usedCount}/{code.usageLimit}</td>
                    <td className="py-3 px-2 text-gray-400 text-xs">{new Date(code.expiresAt).toLocaleString()}</td>
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
