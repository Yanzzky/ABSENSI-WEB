import React, { useState, useEffect } from 'react';
import { 
  History, ShieldAlert, UserPlus, LogIn, 
  Database, Key, Loader2, RefreshCw, Clock 
} from 'lucide-react';

const ActivityLog = ({ SCRIPT_URL }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fungsi Ambil Data Log
  const fetchLogs = async () => {
    if (!SCRIPT_URL) return;
    try {
      setLoading(true);
      // Memanggil action getLogs yang sudah kita buat di Apps Script
      const res = await fetch(`${SCRIPT_URL}?action=getLogs&_t=${new Date().getTime()}`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Gagal load riwayat:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [SCRIPT_URL]);

  // ✨ Fungsi Memilih Ikon Berdasarkan Tipe Log
  const getLogStyle = (type) => {
    const t = String(type).toUpperCase();
    if (t.includes("LOGIN")) return { icon: <LogIn size={20} className="text-emerald-500" />, bg: "bg-emerald-50" };
    if (t.includes("USER") || t.includes("REGISTER")) return { icon: <UserPlus size={20} className="text-blue-500" />, bg: "bg-blue-50" };
    if (t.includes("SECURITY") || t.includes("PASSWORD")) return { icon: <ShieldAlert size={20} className="text-orange-500" />, bg: "bg-orange-50" };
    if (t.includes("DATABASE") || t.includes("ABSEN")) return { icon: <Database size={20} className="text-purple-500" />, bg: "bg-purple-50" };
    return { icon: <History size={20} className="text-gray-400" />, bg: "bg-gray-50" };
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left animate-in slide-in-from-right-4 duration-500">
      
      {/* HEADER LOG */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-gray-900 p-3 rounded-2xl text-white">
            <History size={24} />
          </div>
          <div>
            <h3 className="font-black text-gray-800 uppercase tracking-tighter italic leading-none">Log Aktivitas</h3>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Riwayat Perubahan Sistem</p>
          </div>
        </div>
        <button 
          onClick={fetchLogs} 
          disabled={loading}
          className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl transition-all active:scale-90"
        >
          <RefreshCw size={20} className={loading ? "animate-spin text-blue-600" : ""} />
        </button>
      </div>

      {/* DAFTAR LOG */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white p-20 rounded-[3rem] border border-gray-100 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-600 mb-2" size={32} />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Menarik Data Terbaru...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center">
            <p className="text-sm font-bold text-gray-300 italic uppercase">Belum ada aktivitas yang tercatat</p>
          </div>
        ) : (
          logs.map((log, i) => {
            const style = getLogStyle(log.type);
            return (
              <div key={i} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-all group">
                <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center shrink-0 transition-colors group-hover:bg-white group-hover:shadow-inner`}>
                  {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate mr-2">
                      {log.type} • <span className="text-blue-600 italic">{log.user}</span>
                    </span>
                    <div className="flex items-center gap-1 text-gray-300 shrink-0">
                       <Clock size={10} />
                       <span className="text-[9px] font-bold italic">{log.tanggal}</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-700 leading-tight">
                    {log.action}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4">
        <ShieldAlert size={20} className="text-blue-600 shrink-0" />
        <p className="text-[10px] text-blue-700 font-bold italic leading-relaxed">
          Catatan: Riwayat ini disimpan secara permanen di Google Sheets. Admin tidak dapat menghapus log demi alasan keamanan sistem.
        </p>
      </div>
    </div>
  );
};

export default ActivityLog;