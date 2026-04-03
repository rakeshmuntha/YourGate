import { useState, useEffect, useCallback } from 'react';
import { Plus, QrCode } from 'lucide-react';
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
    const qrUrl = await QRCode.toDataURL(code, { width: 260, margin: 2 });
    setQrModal({ code, qrUrl });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#141414] dark:text-[#EEEEEE] tracking-tight">Access Codes</h1>
          <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">Generate & manage visitor access codes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Generate Code
        </button>
      </div>

      {/* Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {codes.map((code) => (
          <div key={code._id} className="card hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className={code.type === 'GUEST' ? 'badge-active' : 'badge-pending'}>{code.type}</span>
              <span className={code.status === 'ACTIVE' ? 'badge-approved' : 'badge-expired'}>{code.status}</span>
            </div>
            <p className="text-2xl font-mono font-black tracking-[0.25em] text-center my-5 text-[#141414] dark:text-[#EEEEEE]">{code.code}</p>
            <div className="space-y-2.5 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-[#8A8A8A] dark:text-[#616161]">Usage</span>
                <span className="font-semibold text-[#141414] dark:text-[#EEEEEE]">{code.usedCount} / {code.usageLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8A8A] dark:text-[#616161]">Expires</span>
                <span className="font-medium text-[#545454] dark:text-[#616161] text-right max-w-[150px] truncate">{new Date(code.expiresAt).toLocaleString()}</span>
              </div>
            </div>
            {code.status === 'ACTIVE' && (
              <button
                onClick={() => showQR(code.code)}
                className="btn-secondary w-full flex items-center justify-center gap-2 text-sm py-2.5"
              >
                <QrCode className="w-4 h-4" /> Show QR Code
              </button>
            )}
          </div>
        ))}
      </div>

      {codes.length === 0 && (
        <div className="card text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-[#EEEEEE] dark:bg-[#1C1C1C] flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-7 h-7 text-[#ADADAD] dark:text-[#616161]" />
          </div>
          <p className="font-semibold text-[#141414] dark:text-[#EEEEEE]">No access codes yet</p>
          <p className="text-sm text-[#8A8A8A] dark:text-[#616161] mt-1">Generate one to let visitors in</p>
          <button onClick={() => setShowModal(true)} className="btn-primary mt-5 text-sm">
            Generate Code
          </button>
        </div>
      )}

      {/* Generate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#141414] border border-[#E2E2E2] dark:border-[#242424] rounded-3xl w-full max-w-sm p-7 shadow-2xl">
            <h3 className="text-xl font-black text-[#141414] dark:text-[#EEEEEE] mb-6">Generate Access Code</h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#545454] dark:text-[#9E9E9E] mb-2">Visitor Type</label>
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
                <label className="block text-sm font-semibold text-[#545454] dark:text-[#9E9E9E] mb-2">Expires In (hours)</label>
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
                <label className="block text-sm font-semibold text-[#545454] dark:text-[#9E9E9E] mb-2">Usage Limit</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: +e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 text-sm py-2.5">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 text-sm py-2.5">
                  {loading ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setQrModal(null)}
        >
          <div
            className="bg-white dark:bg-[#141414] border border-[#E2E2E2] dark:border-[#242424] rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black text-[#141414] dark:text-[#EEEEEE] mb-1">QR Code</h3>
            <p className="text-2xl font-mono font-black tracking-[0.25em] text-[#141414] dark:text-[#EEEEEE] mb-5">{qrModal.code}</p>
            <div className="bg-white rounded-2xl p-3 inline-block mb-4">
              <img src={qrModal.qrUrl} alt="QR Code" className="w-56 h-56 rounded-xl" />
            </div>
            <p className="text-xs text-[#8A8A8A] dark:text-[#616161] mb-5">Show this to the security guard at the gate</p>
            <button onClick={() => setQrModal(null)} className="btn-secondary w-full text-sm py-2.5">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessCodesPage;
