import React from 'react';
import { History, ShieldAlert, UserPlus, LogIn } from 'lucide-react';

const ActivityLog = () => {
  const logs = [
    { type: 'LOGIN', user: 'Admin', action: 'Berhasil masuk ke sistem', time: '10:45 WIB', icon: <LogIn className="text-emerald-500"/> },
    { type: 'USER', user: 'Admin', action: 'Menambah user baru: Ian Kurniawan', time: '09:30 WIB', icon: <UserPlus className="text-blue-500"/> },
    { type: 'SECURITY', user: 'System', action: 'Update Radius Lokasi Kantor', time: 'Kemarin', icon: <ShieldAlert className="text-orange-500"/> },
  ];

  return (
    <div className="max-w-3xl space-y-4 animate-in slide-in-from-right-4 duration-500">
      {logs.map((log, i) => (
        <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
            {log.icon}
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{log.type} • {log.time}</p>
            <p className="text-sm font-bold text-gray-800">{log.action}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityLog;