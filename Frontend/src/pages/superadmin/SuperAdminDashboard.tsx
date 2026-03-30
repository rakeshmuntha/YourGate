import { useEffect, useState } from 'react';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
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
        <h1 className="text-3xl font-bold">Platform Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all YourGate communities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Communities" count={communities.length} icon={<HiOutlineBuildingOffice2 className="w-6 h-6" />} color="primary" />
        <StatCard label="Pending Approval" count={pending} icon={<HiOutlineBuildingOffice2 className="w-6 h-6" />} color="amber" />
        <StatCard label="Approved" count={approved} icon={<HiOutlineBuildingOffice2 className="w-6 h-6" />} color="green" />
        <StatCard label="Rejected" count={rejected} icon={<HiOutlineBuildingOffice2 className="w-6 h-6" />} color="red" />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
