import { useEffect, useState, useCallback } from 'react';
import { visitorAPI } from '../../services/api';
import { VisitorLog } from '../../types';
import { ClipboardList } from 'lucide-react';

const AdminVisitorLogs = () => {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadLogs = useCallback(async () => {
    const res = await visitorAPI.getLogs(page);
    setLogs(res.data.logs);
    setTotalPages(res.data.totalPages);
  }, [page]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#141414] dark:text-[#EEEEEE] tracking-tight">Visitor Logs</h1>
        <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">All visitor activity in your community</p>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E2E2] dark:border-[#242424]">
                <th className="text-left py-4 px-5 text-xs font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-wider">Visitor</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-wider">Type</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-wider">Code</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-wider">Verified By</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-wider">Entry</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-[#8A8A8A] dark:text-[#616161] uppercase tracking-wider">Exit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F6F6] dark:divide-[#1C1C1C]">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-[#F6F6F6]/50 dark:hover:bg-[#1C1C1C]/50 transition-colors">
                  <td className="py-4 px-5 font-semibold text-[#141414] dark:text-[#EEEEEE]">{log.visitorName}</td>
                  <td className="py-4 px-5">
                    <span className={log.visitorType === 'GUEST' ? 'badge-active' : 'badge-pending'}>{log.visitorType}</span>
                  </td>
                  <td className="py-4 px-5 font-mono text-xs text-[#8A8A8A] dark:text-[#616161] tracking-widest">{log.codeUsed}</td>
                  <td className="py-4 px-5 text-[#8A8A8A] dark:text-[#616161] text-xs">{typeof log.verifiedBy === 'object' ? log.verifiedBy.name : '—'}</td>
                  <td className="py-4 px-5 text-[#8A8A8A] dark:text-[#616161] text-xs">{new Date(log.entryTime).toLocaleString()}</td>
                  <td className="py-4 px-5 text-xs">
                    {log.exitTime
                      ? <span className="text-[#8A8A8A] dark:text-[#616161]">{new Date(log.exitTime).toLocaleString()}</span>
                      : <span className="badge-approved">Inside</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EEEEEE] dark:bg-[#1C1C1C] flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-6 h-6 text-[#ADADAD] dark:text-[#616161]" />
            </div>
            <p className="font-semibold text-[#141414] dark:text-[#EEEEEE] text-sm">No visitor logs</p>
            <p className="text-xs text-[#8A8A8A] dark:text-[#616161] mt-1">Visitor activity will appear here</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E2E2] dark:border-[#242424]">
            <span className="text-xs text-[#8A8A8A] dark:text-[#616161]">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 text-xs font-medium rounded-full border border-[#E2E2E2] dark:border-[#242424] hover:bg-[#F6F6F6] dark:hover:bg-[#1C1C1C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[#545454] dark:text-[#9E9E9E]"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 text-xs font-medium rounded-full border border-[#E2E2E2] dark:border-[#242424] hover:bg-[#F6F6F6] dark:hover:bg-[#1C1C1C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[#545454] dark:text-[#9E9E9E]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVisitorLogs;
