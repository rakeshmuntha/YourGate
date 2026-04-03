import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingAPI, amenityAPI } from '../../services/api';
import { Booking, Amenity, SlotAvailability } from '../../types';
import { CalendarDays, XCircle, Clock } from 'lucide-react';
import { to12hr, slotKeyTo12hr } from '../../utils/time';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ResidentBookingsPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedAmenityId = searchParams.get('amenityId');
  const preselectedName = searchParams.get('name');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(true);
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
    amenityAPI.getAll().then((r) => {
      setAmenities(r.data.amenities);
      setAmenitiesLoading(false);
    });
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
          <h1 className="text-4xl font-bold text-[#141414] dark:text-[#EEEEEE] tracking-tight">My Bookings</h1>
          <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">Manage your amenity bookings</p>
        </div>
        {!showBooking && (
          <button onClick={() => setShowBooking(true)} className="btn-primary flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4" /> New Booking
          </button>
        )}
      </div>

      {/* Booking Form */}
      {showBooking && (
        <div className="card mb-8">
          <h3 className="text-lg font-bold text-[#141414] dark:text-[#EEEEEE] mb-5">
            Book an Amenity{preselectedName && <span className="text-[#8A8A8A] dark:text-[#616161] font-normal"> — {preselectedName}</span>}
          </h3>

          {amenitiesLoading && (
            <div className="mb-6">
              <LoadingSpinner variant="progress-bar" />
            </div>
          )}

          {!amenitiesLoading && (
            <form onSubmit={handleBook} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#545454] dark:text-[#9E9E9E] mb-2">Amenity</label>
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
                  <label className="block text-sm font-semibold text-[#545454] dark:text-[#9E9E9E] mb-2">Date</label>
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
                    <Clock className="w-4 h-4 text-[#8A8A8A]" />
                    <label className="text-sm font-semibold text-[#545454] dark:text-[#9E9E9E]">Available Time Slots</label>
                  </div>

                  {slotsLoading ? (
                    <div className="mb-4">
                      <LoadingSpinner variant="progress-bar" />
                    </div>
                  ) : slotsError ? (
                    <p className="text-sm text-red-500 py-2">{slotsError}</p>
                  ) : slots.length === 0 ? (
                    <div className="py-4 px-4 rounded-xl bg-[#F6F6F6] dark:bg-[#0a0a0a] border border-[#EEEEEE] dark:border-[#242424]">
                      <p className="text-sm text-[#8A8A8A] dark:text-[#616161]">No time slots configured for this amenity.</p>
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
                                ? 'border-[#E2E2E2] dark:border-[#242424] bg-white dark:bg-[#141414] text-[#545454] dark:text-[#9E9E9E] hover:border-[#8A8A8A] dark:hover:border-[#616161]'
                                : 'border-[#EEEEEE] dark:border-[#1C1C1C] bg-[#F6F6F6] dark:bg-[#0a0a0a] text-[#ADADAD] dark:text-[#3C3C3C] cursor-not-allowed line-through'
                            }`}
                          >
                            {to12hr(slot.start)} – {to12hr(slot.end)}
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
          )}
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-3">
        {bookings.map((b) => {
          const amenity = typeof b.amenityId === 'object' ? b.amenityId : null;
          return (
            <div key={b._id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#EEEEEE] dark:bg-[#1C1C1C] flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="w-5 h-5 text-[#8A8A8A] dark:text-[#616161]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#141414] dark:text-[#EEEEEE]">{amenity?.name || 'Amenity'}</h4>
                  <p className="text-xs text-[#8A8A8A] dark:text-[#616161] mt-0.5">
                    {b.date} · {slotKeyTo12hr(b.slotTime)}
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
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {bookings.length === 0 && !showBooking && (
        <div className="card text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-[#EEEEEE] dark:bg-[#1C1C1C] flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-7 h-7 text-[#ADADAD] dark:text-[#616161]" />
          </div>
          <p className="font-semibold text-[#141414] dark:text-[#EEEEEE]">No bookings yet</p>
          <p className="text-sm text-[#8A8A8A] dark:text-[#616161] mt-1">Book an amenity to get started</p>
          <button onClick={() => setShowBooking(true)} className="btn-primary mt-5 text-sm">
            New Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default ResidentBookingsPage;
