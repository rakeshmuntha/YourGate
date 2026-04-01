import { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { User } from '../../types';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineUsers } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ManageUsersPage = () => {
  const [pending, setPending] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<'pending' | 'all'>('pending');

  const loadData = useCallback(async () => {
    const [p, a] = await Promise.all([adminAPI.getPendingUsers(), adminAPI.getUsers()]);
    setPending(p.data.users);
    setAllUsers(a.data.users);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.approveUser(id);
      toast.success('User approved');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminAPI.rejectUser(id);
      toast.success('User rejected');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: 'badge-pending',
      APPROVED: 'badge-approved',
      REJECTED: 'badge-rejected',
    };
    return <span className={map[status] || 'badge'}>{status}</span>;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Manage Users</h1>
        <p className="text-gray-400 mt-1 text-sm">Approve or reject community members</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-[#1a1a1a] rounded-full p-1 w-fit border border-gray-100 dark:border-[#2a2a2a]">
        <button
          onClick={() => setTab('pending')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            tab === 'pending'
              ? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Pending {pending.length > 0 && <span className="ml-1 text-xs">({pending.length})</span>}
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            tab === 'all'
              ? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          All Members {allUsers.length > 0 && <span className="ml-1 text-xs">({allUsers.length})</span>}
        </button>
      </div>

      {tab === 'pending' && (
        <div className="space-y-3">
          {pending.length === 0 && (
            <div className="card text-center py-14">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#222] flex items-center justify-center mx-auto mb-4">
                <HiOutlineUsers className="w-6 h-6 text-gray-400" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">No pending requests</p>
              <p className="text-xs text-gray-400 mt-1">All caught up!</p>
            </div>
          )}
          {pending.map((u) => (
            <div key={u._id || u.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm flex-shrink-0">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{u.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                  <p className="text-xs text-gray-400">
                    {u.role}{u.flatNumber && ` · Flat ${u.flatNumber}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleApprove(u._id || u.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                >
                  <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleReject(u._id || u.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors border border-red-100 dark:border-red-900/30"
                >
                  <HiOutlineXCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'all' && (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#2a2a2a]">
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Flat</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#1e1e1e]">
                {allUsers.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1e1e1e]/50 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-gray-900 dark:text-white">{u.name}</td>
                    <td className="py-3.5 px-5 text-gray-400 text-xs">{u.email}</td>
                    <td className="py-3.5 px-5 text-gray-500 dark:text-gray-400 text-xs">{u.role}</td>
                    <td className="py-3.5 px-5 text-gray-400 text-xs">{u.flatNumber || '—'}</td>
                    <td className="py-3.5 px-5">{statusBadge(u.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
