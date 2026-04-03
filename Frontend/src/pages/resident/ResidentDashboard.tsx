import { useEffect, useState } from 'react';
import { QrCode, CalendarDays, Ticket } from 'lucide-react';
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
        <h1 className="text-4xl font-bold text-[#141414] dark:text-[#EEEEEE] tracking-[-0.025em]">
          Hi, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">Here's your community overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Active Codes" count={activeCodes.length} icon={<QrCode />} color="blue" />
        <StatCard label="Total Codes" count={codes.length} icon={<Ticket />} color="purple" />
        <StatCard label="Active Bookings" count={confirmedBookings.length} icon={<CalendarDays />} color="green" />
      </div>

      {/* Recent Access Codes */}
      <div className="card">
        <h2 className="text-base font-bold text-[#141414] dark:text-[#EEEEEE] mb-5">Recent Access Codes</h2>
        {codes.length === 0 ? (
          <div className="py-8 text-center">
            <QrCode className="w-10 h-10 mx-auto text-[#ADADAD] dark:text-[#3C3C3C] mb-3" />
            <p className="text-sm text-[#8A8A8A] dark:text-[#616161]">No access codes generated yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E2E2] dark:border-[#242424]">
                  <th className="text-left pb-3 px-2 text-[11px] font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-[0.07em]">Code</th>
                  <th className="text-left pb-3 px-2 text-[11px] font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-[0.07em]">Type</th>
                  <th className="text-left pb-3 px-2 text-[11px] font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-[0.07em]">Status</th>
                  <th className="text-left pb-3 px-2 text-[11px] font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-[0.07em]">Usage</th>
                  <th className="text-left pb-3 px-2 text-[11px] font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-[0.07em]">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F6F6] dark:divide-[#1C1C1C]">
                {codes.slice(0, 5).map((code) => (
                  <tr key={code._id}>
                    <td className="py-3 px-2 font-mono font-bold text-[#141414] dark:text-[#EEEEEE] text-sm tracking-widest">{code.code}</td>
                    <td className="py-3 px-2">
                      <span className={code.type === 'GUEST' ? 'badge-active' : 'badge-pending'}>{code.type}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={code.status === 'ACTIVE' ? 'badge-approved' : 'badge-expired'}>{code.status}</span>
                    </td>
                    <td className="py-3 px-2 text-[#8A8A8A] dark:text-[#616161] text-xs">{code.usedCount}/{code.usageLimit}</td>
                    <td className="py-3 px-2 text-[#8A8A8A] dark:text-[#616161] text-xs">{new Date(code.expiresAt).toLocaleString()}</td>
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
