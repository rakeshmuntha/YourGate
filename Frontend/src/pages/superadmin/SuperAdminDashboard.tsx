import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { communityAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import { Community } from '../../types';

const SuperAdminDashboard = () => {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    communityAPI.getAll().then((r) => setCommunities(r.data.communities));
  }, []);

  const pending = communities.filter((c) => c.status === 'PENDING').length;
  const approved = communities.filter((c) => c.status === 'APPROVED').length;
  const rejected = communities.filter((c) => c.status === 'REJECTED').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#141414] dark:text-[#EEEEEE] tracking-[-0.025em]">Platform Overview</h1>
        <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">Manage all YourGate communities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Communities" count={communities.length} icon={<Building2 />} color="primary" />
        <StatCard label="Pending Approval" count={pending} icon={<Building2 />} color="amber" />
        <StatCard label="Approved" count={approved} icon={<Building2 />} color="green" />
        <StatCard label="Rejected" count={rejected} icon={<Building2 />} color="red" />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
