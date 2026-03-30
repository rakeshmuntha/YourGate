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
        <h1 className="text-3xl font-bold">Community Bookings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor all amenity bookings</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-3 font-medium text-gray-500">Resident</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500">Amenity</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500">Date</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500">Slot</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const user = typeof b.userId === 'object' ? b.userId : null;
              const amenity = typeof b.amenityId === 'object' ? b.amenityId : null;
              return (
                <tr key={b._id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-3">
                    <div>
                      <p className="font-medium">{user?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{user?.flatNumber || ''}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3">{amenity?.name || 'N/A'}</td>
                  <td className="py-3 px-3">{b.date}</td>
                  <td className="py-3 px-3">{b.slotTime}</td>
                  <td className="py-3 px-3">
                    <span className={b.status === 'CONFIRMED' ? 'badge-approved' : 'badge-rejected'}>{b.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="text-center py-12">
            <HiOutlineCalendarDays className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">No bookings yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
