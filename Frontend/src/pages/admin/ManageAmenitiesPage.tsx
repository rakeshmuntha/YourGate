import { useEffect, useState, useCallback } from 'react';
import { amenityAPI } from '../../services/api';
import { Amenity } from '../../types';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencilSquare } from 'react-icons/hi2';
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
          <h1 className="text-3xl font-bold">Amenities</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage community amenities</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Add Amenity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map((a) => (
          <div key={a._id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{a.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{a.description}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(a)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                  <HiOutlinePencilSquare className="w-5 h-5 text-gray-500" />
                </button>
                <button onClick={() => handleDelete(a._id)} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30">
                  <HiOutlineTrash className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {a.timeSlots.map((s, i) => (
                <span key={i} className="badge bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                  {s.start} - {s.end}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Max {a.bookingLimitPerUser} bookings per user</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">{editingId ? 'Edit' : 'Create'} Amenity</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Booking Limit Per User</label>
                <input type="number" min={1} max={10} value={form.bookingLimitPerUser} onChange={(e) => setForm({ ...form, bookingLimitPerUser: +e.target.value })} className="input-field" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Time Slots</label>
                  <button type="button" onClick={addSlot} className="text-primary-600 text-sm font-medium">+ Add Slot</button>
                </div>
                <div className="space-y-2">
                  {form.timeSlots.map((slot, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="time" value={slot.start} onChange={(e) => updateSlot(i, 'start', e.target.value)} className="input-field flex-1" />
                      <span className="text-gray-400">to</span>
                      <input type="time" value={slot.end} onChange={(e) => updateSlot(i, 'end', e.target.value)} className="input-field flex-1" />
                      {form.timeSlots.length > 1 && (
                        <button type="button" onClick={() => removeSlot(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAmenitiesPage;
