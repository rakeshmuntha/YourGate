import { useEffect, useState } from 'react';
import { HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { visitorAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import { VisitorLog } from '../../types';

const SecurityDashboard = () => {
  const [activeVisitors, setActiveVisitors] = useState<VisitorLog[]>([]);
  const [logs, setLogs] = useState<VisitorLog[]>([]);

  useEffect(() => {
    visitorAPI.getActive().then((r) => setActiveVisitors(r.data.visitors));
    visitorAPI.getLogs().then((r) => setLogs(r.data.logs));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor visitor access in real-time</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard label="Inside Now" count={activeVisitors.length} icon={<HiOutlineUserGroup className="w-6 h-6" />} color="blue" />
        <StatCard label="Total Today" count={logs.filter((l) => new Date(l.entryTime).toDateString() === new Date().toDateString()).length} icon={<HiOutlineShieldCheck className="w-6 h-6" />} color="green" />
        <StatCard label="Pending Exit" count={activeVisitors.length} icon={<HiOutlineArrowRightOnRectangle className="w-6 h-6" />} color="amber" />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Visitors Currently Inside</h2>
        {activeVisitors.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">No visitors currently inside</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Visitor</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Code</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Entry Time</th>
                </tr>
              </thead>
              <tbody>
                {activeVisitors.map((v) => (
                  <tr key={v._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-2 font-medium">{v.visitorName}</td>
                    <td className="py-3 px-2"><span className={v.visitorType === 'GUEST' ? 'badge-active' : 'badge-pending'}>{v.visitorType}</span></td>
                    <td className="py-3 px-2 font-mono">{v.codeUsed}</td>
                    <td className="py-3 px-2 text-gray-500">{new Date(v.entryTime).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
