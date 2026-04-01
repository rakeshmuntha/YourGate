import { useEffect, useState } from 'react';
import { bookingAPI } from '../../services/api';
import { Booking } from '../../types';
import { HiOutlineCalendarDays } from 'react-icons/hi2';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    bookingAPI.getCommunityBookings().then((r) => setBookings(r.data.bookings));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Community Bookings</h1>
        <p className="text-gray-400 mt-1 text-sm">Monitor all amenity bookings</p>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#2a2a2a]">
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Resident</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amenity</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Slot</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-[#1e1e1e]">
              {bookings.map((b) => {
                const user = typeof b.userId === 'object' ? b.userId : null;
                const amenity = typeof b.amenityId === 'object' ? b.amenityId : null;
                return (
                  <tr key={b._id} className="hover:bg-gray-50/50 dark:hover:bg-[#1e1e1e]/50 transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'N/A'}</p>
                      {user?.flatNumber && <p className="text-xs text-gray-400 mt-0.5">{user.flatNumber}</p>}
                    </td>
                    <td className="py-4 px-5 text-gray-700 dark:text-gray-300">{amenity?.name || 'N/A'}</td>
                    <td className="py-4 px-5 text-gray-500 dark:text-gray-400 text-xs">{b.date}</td>
                    <td className="py-4 px-5 text-gray-500 dark:text-gray-400 text-xs font-mono">{b.slotTime}</td>
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
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#222] flex items-center justify-center mx-auto mb-4">
              <HiOutlineCalendarDays className="w-6 h-6 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">No bookings yet</p>
            <p className="text-xs text-gray-400 mt-1">Booking activity will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
