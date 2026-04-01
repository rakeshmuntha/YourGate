import { useEffect, useState, useCallback } from 'react';
import { amenityAPI } from '../../services/api';
import { Amenity } from '../../types';
import { Plus, Trash2, Pencil, Building2 } from 'lucide-react';
import { to12hr } from '../../utils/time';
import toast from 'react-hot-toast';

const ManageAmenitiesPage = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    bookingLimitPerUser: 2,
    timeSlots: [{ start: '06:00', end: '08:00' }],
  });
  const [loading, setLoading] = useState(false);

  const loadAmenities = useCallback(async () => {
    const res = await amenityAPI.getAll();
    setAmenities(res.data.amenities);
  }, []);

  useEffect(() => { loadAmenities(); }, [loadAmenities]);

  const resetForm = () => {
    setForm({ name: '', description: '', bookingLimitPerUser: 2, timeSlots: [{ start: '06:00', end: '08:00' }] });
    setEditingId(null);
  };

  const openEdit = (a: Amenity) => {
    setForm({
      name: a.name,
      description: a.description,
      bookingLimitPerUser: a.bookingLimitPerUser,
      timeSlots: a.timeSlots,
    });
    setEditingId(a._id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await amenityAPI.update(editingId, form);
        toast.success('Amenity updated');
      } else {
        await amenityAPI.create(form);
        toast.success('Amenity created');
      }
      setShowModal(false);
      resetForm();
      loadAmenities();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this amenity?')) return;
    try {
      await amenityAPI.delete(id);
      toast.success('Deleted');
      loadAmenities();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const addSlot = () => setForm({ ...form, timeSlots: [...form.timeSlots, { start: '', end: '' }] });
  const removeSlot = (i: number) => setForm({ ...form, timeSlots: form.timeSlots.filter((_, idx) => idx !== i) });
  const updateSlot = (i: number, field: 'start' | 'end', value: string) => {
    const slots = [...form.timeSlots];
    slots[i] = { ...slots[i], [field]: value };
    setForm({ ...form, timeSlots: slots });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#141414] dark:text-[#EEEEEE] tracking-tight">Amenities</h1>
          <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">Manage community amenities and time slots</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Amenity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map((a) => (
          <div key={a._id} className="card hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEEEEE] dark:bg-[#1C1C1C] flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-[#8A8A8A] dark:text-[#616161]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#141414] dark:text-[#EEEEEE]">{a.name}</h3>
                  <p className="text-sm text-[#8A8A8A] dark:text-[#616161] mt-0.5 leading-relaxed">{a.description}</p>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0 ml-2">
                <button
                  onClick={() => openEdit(a)}
                  className="p-2 rounded-xl hover:bg-[#EEEEEE] dark:hover:bg-[#242424] transition-colors text-[#8A8A8A] dark:text-[#616161] hover:text-[#545454] dark:hover:text-[#9E9E9E]"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-[#8A8A8A] dark:text-[#616161] hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {a.timeSlots.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#EEEEEE] dark:bg-[#1C1C1C] text-[#545454] dark:text-[#616161]"
                >
                  {to12hr(s.start)}–{to12hr(s.end)}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#8A8A8A] dark:text-[#616161] mt-3">Max {a.bookingLimitPerUser} bookings per user</p>
          </div>
        ))}
      </div>

      {amenities.length === 0 && !showModal && (
        <div className="card text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-[#EEEEEE] dark:bg-[#1C1C1C] flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-[#ADADAD] dark:text-[#616161]" />
          </div>
          <p className="font-semibold text-[#141414] dark:text-[#EEEEEE]">No amenities yet</p>
          <p className="text-sm text-[#8A8A8A] dark:text-[#616161] mt-1">Add your first amenity to get started</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#141414] border border-[#E2E2E2] dark:border-[#242424] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-7 shadow-2xl">
            <h3 className="text-xl font-black text-[#141414] dark:text-[#EEEEEE] mb-6">
              {editingId ? 'Edit' : 'Create'} Amenity
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#545454] dark:text-[#9E9E9E] mb-2">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Swimming Pool"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#545454] dark:text-[#9E9E9E] mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Describe the amenity..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#545454] dark:text-[#9E9E9E] mb-2">Booking Limit Per User</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.bookingLimitPerUser}
                  onChange={(e) => setForm({ ...form, bookingLimitPerUser: +e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-[#545454] dark:text-[#9E9E9E]">Time Slots</label>
                  <button
                    type="button"
                    onClick={addSlot}
                    className="text-xs font-semibold text-[#141414] dark:text-[#EEEEEE] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Slot
                  </button>
                </div>
                <div className="space-y-2">
                  {form.timeSlots.map((slot, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateSlot(i, 'start', e.target.value)}
                        className="input-field flex-1"
                      />
                      <span className="text-[#8A8A8A] dark:text-[#616161] text-sm">→</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateSlot(i, 'end', e.target.value)}
                        className="input-field flex-1"
                      />
                      {form.timeSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSlot(i)}
                          className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="btn-secondary flex-1 text-sm py-2.5"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 text-sm py-2.5">
                  {loading ? 'Saving...' : 'Save Amenity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAmenitiesPage;
