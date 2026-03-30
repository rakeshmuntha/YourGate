import { useEffect, useState, useCallback } from 'react';
import { visitorAPI } from '../../services/api';
import { VisitorLog } from '../../types';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
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
        <h1 className="text-3xl font-bold">Visitor Logs</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track all visitor activity</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-3 font-medium text-gray-500">Visitor</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500">Type</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500">Code</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500">Entry</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500">Exit</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-3 font-medium">{log.visitorName}</td>
                <td className="py-3 px-3">
                  <span className={log.visitorType === 'GUEST' ? 'badge-active' : 'badge-pending'}>{log.visitorType}</span>
                </td>
                <td className="py-3 px-3 font-mono text-xs">{log.codeUsed}</td>
                <td className="py-3 px-3 text-gray-500">{new Date(log.entryTime).toLocaleString()}</td>
                <td className="py-3 px-3 text-gray-500">
                  {log.exitTime ? new Date(log.exitTime).toLocaleString() : <span className="badge-approved">Inside</span>}
                </td>
                <td className="py-3 px-3">
                  {!log.exitTime && (
                    <button
                      onClick={() => handleExit(log._id)}
                      className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                      title="Record exit"
                    >
                      <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && <p className="text-center text-gray-400 py-8">No visitor logs found</p>}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-secondary text-sm">
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn-secondary text-sm">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityVisitorLogs;
