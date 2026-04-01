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

  const todayCount = logs.filter(
    (l) => new Date(l.entryTime).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Security Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">Monitor visitor access in real-time</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Inside Now" count={activeVisitors.length} icon={<HiOutlineUserGroup className="w-5 h-5" />} color="blue" />
        <StatCard label="Total Today" count={todayCount} icon={<HiOutlineShieldCheck className="w-5 h-5" />} color="green" />
        <StatCard label="Pending Exit" count={activeVisitors.length} icon={<HiOutlineArrowRightOnRectangle className="w-5 h-5" />} color="amber" />
      </div>

      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#2a2a2a]">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Visitors Currently Inside</h2>
        </div>
        {activeVisitors.length === 0 ? (
          <div className="py-12 text-center">
            <HiOutlineUserGroup className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-sm text-gray-400">No visitors currently inside</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#2a2a2a]">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Visitor</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Code</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Entry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#1e1e1e]">
                {activeVisitors.map((v) => (
                  <tr key={v._id} className="hover:bg-gray-50/50 dark:hover:bg-[#1e1e1e]/50 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-gray-900 dark:text-white">{v.visitorName}</td>
                    <td className="py-3.5 px-5">
                      <span className={v.visitorType === 'GUEST' ? 'badge-active' : 'badge-pending'}>{v.visitorType}</span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs text-gray-500 dark:text-gray-400 tracking-widest">{v.codeUsed}</td>
                    <td className="py-3.5 px-5 text-gray-400 text-xs">{new Date(v.entryTime).toLocaleTimeString()}</td>
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
