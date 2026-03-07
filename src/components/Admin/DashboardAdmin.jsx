import React from 'react';
import { 
  Users, CalendarCheck, QrCode, Loader2, 
  ArrowUpRight, TrendingUp, ShieldCheck 
} from 'lucide-react';

const DashboardHome = ({ stats, loading, QR_IMAGE_URL, QR_DATA, user }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* BARIS 1: WELCOME & QR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Welcome Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-700 to-blue-500 p-8 lg:p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              <ShieldCheck size={14} className="text-blue-100" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-50">Sistem Terverifikasi</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-black mb-3 tracking-tight italic">
              SELAMAT DATANG, {user?.nama?.split(' ')[0] || "ADMIN"}! 👋
            </h3>
            <p className="text-blue-100 text-sm lg:text-base opacity-90 max-w-md leading-relaxed font-medium">
              Panel kendali presensi aktif. Seluruh data masuk disinkronkan otomatis setiap 10 detik dari database pusat.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-wrap gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} /> Status: Real-time
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest">
              Server: Online
            </div>
          </div>

          {/* Ornamen Background */}
          <QrCode className="absolute -right-12 -bottom-12 w-64 h-64 text-white/10 rotate-12" />
        </div>

        {/* QR CODE CARD */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500">
          <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-tighter italic">QR LOKASI</h2>
          
          <div className="bg-gray-50 p-6 rounded-[2.5rem] border-2 border-dashed border-gray-200 mb-6 group-hover:border-blue-200 transition-colors relative">
            <img 
              src={QR_IMAGE_URL} 
              alt="QR Code" 
              className="w-40 h-40 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          
          <div className="w-full bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <p className="text-[10px] font-bold text-blue-400 uppercase mb-1 tracking-widest">ID Lokasi Kantor</p>
            <p className="font-mono text-sm font-black text-blue-600 uppercase tracking-tighter">{QR_DATA}</p>
          </div>
        </div>
      </div>

      {/* BARIS 2: STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Total Karyawan */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:border-blue-500 transition-all duration-300">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
            <Users size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total Karyawan</p>
            <h3 className="text-4xl font-black text-gray-800 tracking-tighter mt-1 flex items-center gap-3">
              {loading ? <Loader2 className="animate-spin text-blue-500" size={24} /> : stats.totalKaryawan}
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">Jiwa</span>
            </h3>
          </div>
        </div>

        {/* Card Hadir Hari Ini */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:border-emerald-500 transition-all duration-300">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
            <CalendarCheck size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Hadir Hari Ini</p>
            <h3 className="text-4xl font-black text-emerald-600 tracking-tighter mt-1 flex items-center gap-3">
              {loading ? <Loader2 className="animate-spin text-emerald-500" size={24} /> : stats.hadirHariIni}
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">Hadir</span>
            </h3>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardHome;