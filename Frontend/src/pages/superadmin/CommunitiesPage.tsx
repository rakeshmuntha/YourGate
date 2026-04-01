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
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Communities</h1>
                <p className="text-gray-400 mt-1 text-sm">Review and manage community registrations</p>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-[#1a1a1a] rounded-full p-1 w-fit border border-gray-100 dark:border-[#2a2a2a]">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                            filter === f
                                ? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        {f} ({f === 'ALL' ? communities.length : communities.filter((c) => c.status === f).length})
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filtered.map((c) => {
                    const admin = typeof c.adminId === 'object' ? c.adminId : null;
                    return (
                        <div key={c._id} className="card hover:shadow-sm transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#222] flex items-center justify-center flex-shrink-0">
                                        <HiOutlineBuildingOffice2 className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{c.communityName}</h3>
                                            {statusBadge(c.status)}
                                        </div>
                                        <p className="text-sm text-gray-400">{c.address}</p>
                                        {admin && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                Admin: {admin.name} · {admin.email}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Registered {new Date(c.createdAt).toLocaleDateString()} ·{' '}
                                            Payment: {c.paymentCompleted ? 'Completed' : 'Pending'}
                                        </p>
                                    </div>
                                </div>

                                {c.status === 'PENDING' && (
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleApprove(c._id)}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                                        >
                                            <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(c._id)}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors"
                                        >
                                            <HiOutlineXCircle className="w-3.5 h-3.5" /> Reject
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
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-[#222] flex items-center justify-center mx-auto mb-4">
                        <HiOutlineBuildingOffice2 className="w-7 h-7 text-gray-400" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">No communities found</p>
                </div>
            )}
        </div>
    );
};

export default CommunitiesPage;
