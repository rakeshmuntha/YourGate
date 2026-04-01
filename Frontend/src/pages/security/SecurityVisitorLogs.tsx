import { useEffect, useState, useCallback } from 'react';
import { visitorAPI } from '../../services/api';
import { VisitorLog } from '../../types';
import { HiOutlineArrowRightOnRectangle, HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const SecurityVisitorLogs = () => {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadLogs = useCallback(async () => {
    const res = await visitorAPI.getLogs(page);
    setLogs(res.data.logs);
    setTotalPages(res.data.totalPages);
  }, [page]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const handleExit = async (logId: string) => {
    try {
      await visitorAPI.exit(logId);
      toast.success('Exit recorded');
      loadLogs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Visitor Logs</h1>
        <p className="text-gray-400 mt-1 text-sm">Track all visitor activity</p>
      </div>

      <div className="card overflow-hidden p-0">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#2a2a2a]">
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Visitor</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Code</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Entry</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Exit</th>
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-[#1e1e1e]">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50/50 dark:hover:bg-[#1e1e1e]/50 transition-colors">
                  <td className="py-4 px-5 font-semibold text-gray-900 dark:text-white">{log.visitorName}</td>
                  <td className="py-4 px-5">
                    <span className={log.visitorType === 'GUEST' ? 'badge-active' : 'badge-pending'}>{log.visitorType}</span>
                  </td>
                  <td className="py-4 px-5 font-mono text-xs text-gray-500 dark:text-gray-400 tracking-widest">{log.codeUsed}</td>
                  <td className="py-4 px-5 text-gray-500 dark:text-gray-400 text-xs">{new Date(log.entryTime).toLocaleString()}</td>
                  <td className="py-4 px-5 text-xs">
                    {log.exitTime
                      ? <span className="text-gray-400">{new Date(log.exitTime).toLocaleString()}</span>
                      : <span className="badge-approved">Inside</span>
                    }
                  </td>
                  <td className="py-4 px-5">
                    {!log.exitTime && (
                      <button
                        onClick={() => handleExit(log._id)}
                        className="p-2 rounded-xl text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                        title="Record exit"
                      >
                        <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#222] flex items-center justify-center mx-auto mb-4">
              <HiOutlineClipboardDocumentList className="w-6 h-6 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">No visitor logs found</p>
            <p className="text-xs text-gray-400 mt-1">Logs will appear here once visitors check in</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-[#2a2a2a]">
            <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 text-xs font-medium rounded-full border border-gray-200 dark:border-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#222] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 text-xs font-medium rounded-full border border-gray-200 dark:border-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#222] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
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

export default SecurityVisitorLogs;
