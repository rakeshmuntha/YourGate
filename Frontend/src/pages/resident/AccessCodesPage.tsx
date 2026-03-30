import { useState, useEffect, useCallback } from 'react';
import { HiOutlinePlus, HiOutlineQrCode } from 'react-icons/hi2';
import QRCode from 'qrcode';
import { accessCodeAPI } from '../../services/api';
import { AccessCode } from '../../types';
import toast from 'react-hot-toast';

const AccessCodesPage = () => {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [qrModal, setQrModal] = useState<{ code: string; qrUrl: string } | null>(null);
  const [form, setForm] = useState({ type: 'GUEST', expiresInHours: 24, usageLimit: 1 });
  const [loading, setLoading] = useState(false);

  const loadCodes = useCallback(async () => {
    const res = await accessCodeAPI.getMyCodes();
    setCodes(res.data.codes);
  }, []);

  useEffect(() => { loadCodes(); }, [loadCodes]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await accessCodeAPI.generate(form);
      toast.success('Access code generated!');
      setShowModal(false);
      loadCodes();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  const showQR = async (code: string) => {
    const qrUrl = await QRCode.toDataURL(code, { width: 250, margin: 2 });
    setQrModal({ code, qrUrl });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Access Codes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Generate & manage visitor access codes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Generate Code
        </button>
      </div>

      {/* Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {codes.map((code) => (
          <div key={code._id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className={code.type === 'GUEST' ? 'badge-active' : 'badge-pending'}>{code.type}</span>
              <span className={code.status === 'ACTIVE' ? 'badge-approved' : 'badge-expired'}>{code.status}</span>
            </div>
            <p className="text-2xl font-mono font-bold tracking-widest text-center my-4">{code.code}</p>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Usage</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{code.usedCount} / {code.usageLimit}</span>
              </div>
              <div className="flex justify-between">
                <span>Expires</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(code.expiresAt).toLocaleString()}</span>
              </div>
            </div>
            {code.status === 'ACTIVE' && (
              <button onClick={() => showQR(code.code)} className="btn-secondary w-full mt-4 flex items-center justify-center gap-2">
                <HiOutlineQrCode className="w-5 h-5" /> Show QR Code
              </button>
            )}
          </div>
        ))}
      </div>

      {codes.length === 0 && (
        <div className="card text-center py-16">
          <HiOutlineQrCode className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No access codes yet. Generate one to get started!</p>
        </div>
      )}

      {/* Generate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="card w-full max-w-md">
            <h3 className="text-xl font-bold mb-6">Generate Access Code</h3>
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Visitor Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="input-field"
                >
                  <option value="GUEST">Guest</option>
                  <option value="DELIVERY">Delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expires In (hours)</label>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={form.expiresInHours}
                  onChange={(e) => setForm({ ...form, expiresInHours: +e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Usage Limit</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: +e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setQrModal(null)}>
          <div className="card w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">QR Code</h3>
            <p className="text-2xl font-mono font-bold tracking-widest mb-4">{qrModal.code}</p>
            <img src={qrModal.qrUrl} alt="QR Code" className="mx-auto rounded-xl" />
            <p className="text-sm text-gray-400 mt-4">Show this to the security guard at the gate</p>
            <button onClick={() => setQrModal(null)} className="btn-secondary w-full mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessCodesPage;
