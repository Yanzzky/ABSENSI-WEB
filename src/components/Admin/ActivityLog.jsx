import React, { useState, useEffect } from 'react';
import { History, ShieldAlert, UserPlus, LogIn, Database, Key, Loader2, RefreshCw } from 'lucide-react';

const ActivityLog = ({ SCRIPT_URL }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Ambil data dari tab Logs (Asumsikan ada action 'getLogs' atau ambil semua)
      const res = await fetch(`${SCRIPT_URL}?action=getLogs&_t=${new Date().getTime()}`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Gagal ambil log:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [SCRIPT_URL]);

  // Fungsi pilih ikon berdasarkan tipe log
  const getIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'LOGIN': return <LogIn className="text-emerald-500" />;
      case 'USER': return <UserPlus className="text-blue-500" />;
      case 'SECURITY': return <ShieldAlert className="text-orange-500" />;
      case 'DATABASE': return <Database className="text-purple-500" />;
      case 'PASSWORD': return <Key className="text-red-500" />;
      default: return <History className="text-gray-400" />;
    }
  };

  return (
    <div className="max-w-3xl space-y-4 animate-in slide-in-from-right-4 duration-500 text-left">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-gray-800 italic uppercase tracking-tighter">Riwayat Aktivitas Sistem</h3>
        <button onClick={fetchLogs} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
          <RefreshCw size={20} className={loading ? "animate-spin text-blue-600" : "text-gray-400"} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="animate-spin mx-auto text-blue-600 mb-2" size={32} />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat Riwayat...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white p-10 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
          <p className="text-sm font-bold text-gray-300 italic uppercase">Belum ada rekaman aktivitas</p>
        </div>
      ) : (
        logs.map((log, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
              {getIcon(log.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {log.type} • <span className="text-blue-600">{log.user}</span>
                </p>
                <p className="text-[10px] font-bold text-gray-300 italic">{log.tanggal}</p>
              </div>
              <p className="text-sm font-bold text-gray-800 mt-0.5 tracking-tight leading-tight">
                {log.action}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityLog;