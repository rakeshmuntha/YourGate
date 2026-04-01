import { useEffect, useState, useCallback } from 'react';
import { communityAPI } from '../../services/api';
import { Community } from '../../types';
import { CheckCircle, XCircle, Building2 } from 'lucide-react';
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
                <h1 className="text-3xl font-black text-[#141414] dark:text-[#EEEEEE] tracking-tight">Communities</h1>
                <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">Review and manage community registrations</p>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 mb-6 bg-[#F6F6F6] dark:bg-[#1C1C1C] rounded-full p-1 w-fit border border-[#EEEEEE] dark:border-[#242424]">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                            filter === f
                                ? 'bg-white dark:bg-[#242424] text-[#141414] dark:text-[#EEEEEE] shadow-sm'
                                : 'text-[#8A8A8A] dark:text-[#616161] hover:text-[#545454] dark:hover:text-[#9E9E9E]'
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
                                    <div className="w-12 h-12 rounded-2xl bg-[#EEEEEE] dark:bg-[#1C1C1C] flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-6 h-6 text-[#8A8A8A] dark:text-[#616161]" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-[#141414] dark:text-[#EEEEEE]">{c.communityName}</h3>
                                            {statusBadge(c.status)}
                                        </div>
                                        <p className="text-sm text-[#8A8A8A] dark:text-[#616161]">{c.address}</p>
                                        {admin && (
                                            <p className="text-xs text-[#8A8A8A] dark:text-[#616161] mt-1">
                                                Admin: {admin.name} · {admin.email}
                                            </p>
                                        )}
                                        <p className="text-xs text-[#8A8A8A] dark:text-[#616161] mt-0.5">
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
                                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(c._id)}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors"
                                        >
                                            <XCircle className="w-3.5 h-3.5" /> Reject
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
                    <div className="w-14 h-14 rounded-2xl bg-[#EEEEEE] dark:bg-[#1C1C1C] flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-7 h-7 text-[#ADADAD] dark:text-[#616161]" />
                    </div>
                    <p className="font-semibold text-[#141414] dark:text-[#EEEEEE] text-sm">No communities found</p>
                </div>
            )}
        </div>
    );
};

export default CommunitiesPage;
