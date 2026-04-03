import { useEffect, useState } from 'react';
import { bookingAPI } from '../../services/api';
import { Booking } from '../../types';
import { CalendarDays } from 'lucide-react';
import { slotKeyTo12hr } from '../../utils/time';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    bookingAPI.getCommunityBookings().then((r) => setBookings(r.data.bookings));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#141414] dark:text-[#EEEEEE] tracking-tight">Community Bookings</h1>
        <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">Monitor all amenity bookings</p>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E2E2] dark:border-[#242424]">
                <th className="text-left py-4 px-5 text-xs font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-wider">Resident</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-wider">Amenity</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-wider">Slot</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F6F6] dark:divide-[#1C1C1C]">
              {bookings.map((b) => {
                const user = typeof b.userId === 'object' ? b.userId : null;
                const amenity = typeof b.amenityId === 'object' ? b.amenityId : null;
                return (
                  <tr key={b._id} className="hover:bg-[#F6F6F6]/50 dark:hover:bg-[#1C1C1C]/50 transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-semibold text-[#141414] dark:text-[#EEEEEE]">{user?.name || 'N/A'}</p>
                      {user?.flatNumber && <p className="text-xs text-[#8A8A8A] dark:text-[#616161] mt-0.5">{user.flatNumber}</p>}
                    </td>
                    <td className="py-4 px-5 text-[#545454] dark:text-[#9E9E9E]">{amenity?.name || 'N/A'}</td>
                    <td className="py-4 px-5 text-[#8A8A8A] dark:text-[#616161] text-xs">{b.date}</td>
                    <td className="py-4 px-5 text-[#8A8A8A] dark:text-[#616161] text-xs">{slotKeyTo12hr(b.slotTime)}</td>
                    <td className="py-4 px-5">
                      <span className={b.status === 'CONFIRMED' ? 'badge-approved' : 'badge-rejected'}>{b.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {bookings.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EEEEEE] dark:bg-[#1C1C1C] flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-6 h-6 text-[#ADADAD] dark:text-[#616161]" />
            </div>
            <p className="font-semibold text-[#141414] dark:text-[#EEEEEE] text-sm">No bookings yet</p>
            <p className="text-xs text-[#8A8A8A] dark:text-[#616161] mt-1">Booking activity will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
