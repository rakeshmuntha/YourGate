import { useEffect, useState } from 'react';
import { ShieldCheck, UsersRound, LogOut } from 'lucide-react';
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
        <h1 className="text-3xl font-black text-[#141414] dark:text-[#EEEEEE] tracking-[-0.025em]">Security Dashboard</h1>
        <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">Monitor visitor access in real-time</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Inside Now" count={activeVisitors.length} icon={<UsersRound />} color="blue" />
        <StatCard label="Total Today" count={todayCount} icon={<ShieldCheck />} color="green" />
        <StatCard label="Pending Exit" count={activeVisitors.length} icon={<LogOut />} color="amber" />
      </div>

      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-[#E2E2E2] dark:border-[#242424]">
          <h2 className="text-base font-bold text-[#141414] dark:text-[#EEEEEE]">Visitors Currently Inside</h2>
        </div>
        {activeVisitors.length === 0 ? (
          <div className="py-12 text-center">
            <UsersRound className="w-10 h-10 mx-auto text-[#ADADAD] dark:text-[#3C3C3C] mb-3" />
            <p className="text-sm text-[#8A8A8A] dark:text-[#616161]">No visitors currently inside</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E2E2] dark:border-[#242424]">
                  <th className="text-left py-3 px-5 text-[11px] font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-[0.07em]">Visitor</th>
                  <th className="text-left py-3 px-5 text-[11px] font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-[0.07em]">Type</th>
                  <th className="text-left py-3 px-5 text-[11px] font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-[0.07em]">Code</th>
                  <th className="text-left py-3 px-5 text-[11px] font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-[0.07em]">Entry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F6F6] dark:divide-[#1C1C1C]">
                {activeVisitors.map((v) => (
                  <tr key={v._id} className="hover:bg-[#F6F6F6]/50 dark:hover:bg-[#1C1C1C]/50 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[#141414] dark:text-[#EEEEEE]">{v.visitorName}</td>
                    <td className="py-3.5 px-5">
                      <span className={v.visitorType === 'GUEST' ? 'badge-active' : 'badge-pending'}>{v.visitorType}</span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs text-[#8A8A8A] dark:text-[#616161] tracking-widest">{v.codeUsed}</td>
                    <td className="py-3.5 px-5 text-[#8A8A8A] dark:text-[#616161] text-xs">{new Date(v.entryTime).toLocaleTimeString()}</td>
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
