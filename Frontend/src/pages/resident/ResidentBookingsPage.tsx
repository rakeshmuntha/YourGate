import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingAPI, amenityAPI } from '../../services/api';
import { Booking, Amenity, SlotAvailability } from '../../types';
import { HiOutlineCalendarDays, HiOutlineXCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ResidentBookingsPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedAmenityId = searchParams.get('amenityId');
  const preselectedName = searchParams.get('name');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [showBooking, setShowBooking] = useState(!!preselectedAmenityId);
  const [form, setForm] = useState({
    amenityId: preselectedAmenityId || '',
    date: new Date().toISOString().split('T')[0],
    slotTime: '',
  });
  const [loading, setLoading] = useState(false);

  const loadBookings = useCallback(async () => {
    const res = await bookingAPI.getMyBookings();
    setBookings(res.data.bookings);
  }, []);

  useEffect(() => {
    loadBookings();
    amenityAPI.getAll().then((r) => setAmenities(r.data.amenities));
  }, [loadBookings]);

  useEffect(() => {
    if (form.amenityId && form.date) {
      bookingAPI.getAvailability(form.amenityId, form.date).then((r) => setSlots(r.data.slots));
    }
  }, [form.amenityId, form.date]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slotTime) { toast.error('Select a time slot'); return; }
    setLoading(true);
    try {
      await bookingAPI.create(form);
      toast.success('Booking confirmed!');
      setShowBooking(false);
      setForm({ amenityId: '', date: new Date().toISOString().split('T')[0], slotTime: '' });
      loadBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await bookingAPI.cancel(id);
      toast.success('Booking cancelled');
      loadBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your amenity bookings</p>
        </div>
        {!showBooking && (
          <button onClick={() => setShowBooking(true)} className="btn-primary flex items-center gap-2">
            <HiOutlineCalendarDays className="w-5 h-5" /> New Booking
          </button>
        )}
      </div>

      {/* Booking Form */}
      {showBooking && (
        <div className="card mb-8">
          <h3 className="text-lg font-bold mb-4">Book an Amenity {preselectedName && `— ${preselectedName}`}</h3>
          <form onSubmit={handleBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amenity</label>
                <select
                  value={form.amenityId}
                  onChange={(e) => setForm({ ...form, amenityId: e.target.value, slotTime: '' })}
                  className="input-field"
                  required
                >
                  <option value="">Select amenity</option>
                  {amenities.map((a) => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setForm({ ...form, date: e.target.value, slotTime: '' })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {slots.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Available Slots</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {slots.map((slot) => {
                    const slotKey = `${slot.start}-${slot.end}`;
                    return (
                      <button
                        key={slotKey}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setForm({ ...form, slotTime: slotKey })}
                        className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${
                          form.slotTime === slotKey
                            ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                            : slot.available
                            ? 'border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30'
                            : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed line-through'
                        }`}
                      >
                        {slot.start} - {slot.end}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowBooking(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={loading || !form.slotTime} className="btn-primary flex-1">
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-3">
        {bookings.map((b) => {
          const amenity = typeof b.amenityId === 'object' ? b.amenityId : null;
          return (
            <div key={b._id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <HiOutlineCalendarDays className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold">{amenity?.name || 'Amenity'}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {b.date} | {b.slotTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={b.status === 'CONFIRMED' ? 'badge-approved' : 'badge-rejected'}>
                  {b.status}
                </span>
                {b.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Cancel booking"
                  >
                    <HiOutlineXCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {bookings.length === 0 && !showBooking && (
        <div className="card text-center py-16">
          <HiOutlineCalendarDays className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No bookings yet</p>
        </div>
      )}
    </div>
  );
};

export default ResidentBookingsPage;
