import { useEffect, useState, useCallback } from 'react';
import { communityAPI } from '../../services/api';
import { Community } from '../../types';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const loadData = useCallback(async () => {
    const res = await communityAPI.getAll();
    setCommunities(res.data.communities);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleApprove = async (id: string) => {
    try {
      await communityAPI.approve(id);
      toast.success('Community approved');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await communityAPI.reject(id);
      toast.success('Community rejected');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const filtered = filter === 'ALL' ? communities : communities.filter((c) => c.status === filter);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected' };
    return <span className={map[status] || 'badge'}>{status}</span>;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Communities</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage community registrations</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f ? 'bg-white dark:bg-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f} ({f === 'ALL' ? communities.length : communities.filter((c) => c.status === f).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((c) => {
          const admin = typeof c.adminId === 'object' ? c.adminId : null;
          return (
            <div key={c._id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <HiOutlineBuildingOffice2 className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold">{c.communityName}</h3>
                      {statusBadge(c.status)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{c.address}</p>
                    {admin && (
                      <p className="text-xs text-gray-400 mt-1">
                        Admin: {admin.name} ({admin.email})
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Registered: {new Date(c.createdAt).toLocaleDateString()}
                      {' | '}Payment: {c.paymentCompleted ? '✓ Completed' : '✗ Pending'}
                    </p>
                  </div>
                </div>

                {c.status === 'PENDING' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleApprove(c._id)} className="btn-success flex items-center gap-1">
                      <HiOutlineCheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleReject(c._id)} className="btn-danger flex items-center gap-1">
                      <HiOutlineXCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-16">
          <HiOutlineBuildingOffice2 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No communities found</p>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;
