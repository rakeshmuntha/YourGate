import { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { User } from '../../types';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
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
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Approve or reject community members</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('pending')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'pending' ? 'bg-white dark:bg-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'all' ? 'bg-white dark:bg-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Users ({allUsers.length})
        </button>
      </div>

      {tab === 'pending' && (
        <div className="space-y-3">
          {pending.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-gray-400">No pending requests</p>
            </div>
          )}
          {pending.map((u) => (
            <div key={u._id || u.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 font-bold">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{u.name}</h4>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  <p className="text-xs text-gray-400">
                    {u.role} {u.flatNumber && `| Flat ${u.flatNumber}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleApprove(u._id || u.id)} className="btn-success flex items-center gap-1 text-sm">
                  <HiOutlineCheckCircle className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => handleReject(u._id || u.id)} className="btn-danger flex items-center gap-1 text-sm">
                  <HiOutlineXCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'all' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-3 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Role</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Flat</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u._id || u.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-3 font-medium">{u.name}</td>
                  <td className="py-3 px-3 text-gray-500">{u.email}</td>
                  <td className="py-3 px-3">{u.role}</td>
                  <td className="py-3 px-3">{u.flatNumber || '—'}</td>
                  <td className="py-3 px-3">{statusBadge(u.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
