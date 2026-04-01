import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingAPI, amenityAPI } from '../../services/api';
import { Booking, Amenity, SlotAvailability } from '../../types';
import { HiOutlineCalendarDays, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ResidentBookingsPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedAmenityId = searchParams.get('amenityId');
  const preselectedName = searchParams.get('name');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');
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

  // Fetch available slots whenever amenity or date changes — with proper error handling
  useEffect(() => {
    if (form.amenityId && form.date) {
      setSlotsLoading(true);
      setSlotsError('');
      setSlots([]);
      bookingAPI
        .getAvailability(form.amenityId, form.date)
        .then((r) => setSlots(r.data.slots))
        .catch(() => setSlotsError('Could not load time slots. Please try again.'))
        .finally(() => setSlotsLoading(false));
    } else {
      setSlots([]);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">My Bookings</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your amenity bookings</p>
        </div>
        {!showBooking && (
          <button onClick={() => setShowBooking(true)} className="btn-primary flex items-center gap-2 text-sm">
            <HiOutlineCalendarDays className="w-4 h-4" /> New Booking
          </button>
        )}
      </div>

      {/* Booking Form */}
      {showBooking && (
        <div className="card mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
            Book an Amenity{preselectedName && <span className="text-gray-400 font-normal"> — {preselectedName}</span>}
          </h3>
          <form onSubmit={handleBook} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Amenity</label>
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
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date</label>
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

            {/* Time Slots — always shown when amenity & date are selected */}
            {form.amenityId && form.date && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <HiOutlineClock className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Available Time Slots</label>
                </div>

                {slotsLoading ? (
                  <div className="flex items-center gap-2 py-3 text-sm text-gray-400">
                    <div className="w-4 h-4 border-2 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
                    Loading slots...
                  </div>
                ) : slotsError ? (
                  <p className="text-sm text-red-500 py-2">{slotsError}</p>
                ) : slots.length === 0 ? (
                  <div className="py-4 px-4 rounded-xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#2a2a2a]">
                    <p className="text-sm text-gray-400">No time slots configured for this amenity.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {slots.map((slot) => {
                      const slotKey = `${slot.start}-${slot.end}`;
                      return (
                        <button
                          key={slotKey}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setForm({ ...form, slotTime: slotKey })}
                          className={`py-3 px-3 rounded-xl text-sm font-semibold transition-all border ${
                            form.slotTime === slotKey
                              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                              : slot.available
                              ? 'border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                              : 'border-gray-100 dark:border-[#1e1e1e] bg-gray-50 dark:bg-[#111] text-gray-300 dark:text-gray-600 cursor-not-allowed line-through'
                          }`}
                        >
                          {slot.start} – {slot.end}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowBooking(false); setSlots([]); }}
                className="btn-secondary flex-1 text-sm py-2.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !form.slotTime}
                className="btn-primary flex-1 text-sm py-2.5"
              >
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
            <div key={b._id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-[#222] flex items-center justify-center flex-shrink-0">
                  <HiOutlineCalendarDays className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{amenity?.name || 'Amenity'}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {b.date} · {b.slotTime}
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
                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
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
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-[#222] flex items-center justify-center mx-auto mb-4">
            <HiOutlineCalendarDays className="w-7 h-7 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-900 dark:text-white">No bookings yet</p>
          <p className="text-sm text-gray-400 mt-1">Book an amenity to get started</p>
          <button onClick={() => setShowBooking(true)} className="btn-primary mt-5 text-sm">
            New Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default ResidentBookingsPage;
