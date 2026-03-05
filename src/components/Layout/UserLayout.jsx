import React, { useState } from 'react';
import { Home, Calendar, QrCode, FileText, LogOut, User as UserIcon } from 'lucide-react';
import Dashboard from '../Dashboard/Dashboard';
import ScannerArea from '../Presensi/ScannerArea';
import JadwalMingguan from '../jadwal/JadwalMingguan'; // Pastikan path ini benar (Jadwal/jadwal)
import Riwayat from '../Riwayat/Riwayat';

const UserLayout = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('DASHBOARD');

  const renderContent = () => {
  switch (activeMenu) {
    case 'DASHBOARD': 
      return <Dashboard user={user} onScanClick={() => setActiveMenu('SCAN')} />;
    case 'JADWAL': 
      return <JadwalMingguan />;
    case 'SCAN': 
      return <ScannerArea user={user} onSuccess={() => setActiveMenu('DASHBOARD')} />;
    
    // UBAH BARIS INI: Tambahkan userId={user.id}
    case 'RIWAYAT': 
      return <Riwayat userId={user?.id} />; 
      
    default: 
      return <Dashboard user={user} />;
  }
};

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden w-full">
      
      {/* ========================================== */}
      {/* 1. SIDEBAR KIRI (KHUSUS DESKTOP) */}
      {/* ========================================== */}
      <aside className="hidden md:flex flex-col w-72 bg-blue-700 text-white shadow-2xl relative z-20">
        <div className="p-8 border-b border-blue-600/50">
          <h1 className="text-3xl font-bold tracking-wide flex items-center gap-2">
            <QrCode className="w-8 h-8" /> PresensiKu
          </h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
          <button 
            onClick={() => setActiveMenu('DASHBOARD')} 
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-medium ${activeMenu === 'DASHBOARD' ? 'bg-white text-blue-700 shadow-lg scale-105' : 'text-blue-100 hover:bg-blue-600 hover:text-white'}`}
          >
            <Home className="w-6 h-6" /> Beranda
          </button>
          
          <button 
            onClick={() => setActiveMenu('JADWAL')} 
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-medium ${activeMenu === 'JADWAL' ? 'bg-white text-blue-700 shadow-lg scale-105' : 'text-blue-100 hover:bg-blue-600 hover:text-white'}`}
          >
            <Calendar className="w-6 h-6" /> Jadwal Mingguan
          </button>

          <button 
            onClick={() => setActiveMenu('SCAN')} 
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${activeMenu === 'SCAN' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105' : 'bg-blue-800 text-white shadow-md hover:bg-blue-900 border border-blue-600'}`}
          >
            <QrCode className="w-6 h-6" /> Scan Presensi
          </button>

          <button 
            onClick={() => setActiveMenu('RIWAYAT')} 
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-medium ${activeMenu === 'RIWAYAT' ? 'bg-white text-blue-700 shadow-lg scale-105' : 'text-blue-100 hover:bg-blue-600 hover:text-white'}`}
          >
            <FileText className="w-6 h-6" /> Riwayat Presensi
          </button>
        </nav>
      </aside>

      {/* PROFIL POJOK KANAN ATAS */}
<div className="absolute top-6 right-6 z-[100] flex items-center gap-4">
  {/* Notifikasi & Nama (Sesuai Gambar) */}
  <div className="flex flex-col items-end">
    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none mb-1">Online</p>
    <h4 className="text-sm font-black text-gray-800 leading-none">{user?.nama}</h4>
    <p className="text-[10px] text-gray-400 mt-1">{user?.identitas}</p>
  </div>

  {/* Avatar Bulat (Mirip Inisial "AD" di gambar) */}
  <div className="relative group">
    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 border-2 border-white transition-transform group-hover:scale-105 cursor-pointer">
      {user?.nama ? user.nama.substring(0, 2).toUpperCase() : "AD"}
    </div>

    {/* Dropdown Logout yang muncul saat hover atau klik */}
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
      <button 
        onClick={onLogout}
        className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold text-xs"
      >
        <LogOut size={16} /> Keluar Akun
      </button>
    </div>
  </div>
</div>


      {/* ========================================== */}
      {/* 2. AREA KONTEN UTAMA (MOBILE & DESKTOP) */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col relative max-w-full md:max-w-none mx-auto w-full bg-gray-50 md:bg-gray-100">
        
        {/* HEADER KHUSUS MOBILE */}
        <div className="md:hidden bg-blue-600 text-white p-6 rounded-b-[2rem] shadow-md z-10 relative">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
              <QrCode className="w-5 h-5"/> PresensiKu
            </h1>
            <button onClick={onLogout} className="bg-blue-700/50 hover:bg-red-500 p-2 rounded-full transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="text-sm text-blue-100">Selamat bekerja,</p>
            <p className="text-lg font-bold">{user?.nama}</p>
            <p className="text-xs text-blue-200 mt-1">{user?.identitas}</p>
          </div>
        </div>

        {/* AREA KONTEN DINAMIS */}
        <div className="flex-1 overflow-y-auto w-full pb-24 md:pb-8 p-0 md:p-8">
          <div className="max-w-md md:max-w-4xl mx-auto w-full">
            {renderContent()}
          </div>
        </div>

        {/* ========================================== */}
        {/* 3. BOTTOM NAVIGATION (KHUSUS MOBILE) */}
        {/* ========================================== */}

        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
          <button onClick={() => setActiveMenu('DASHBOARD')} className={`flex flex-col items-center ${activeMenu === 'DASHBOARD' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button onClick={() => setActiveMenu('JADWAL')} className={`flex flex-col items-center ${activeMenu === 'JADWAL' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Jadwal</span>
          </button>
          
          <button onClick={() => setActiveMenu('SCAN')} className={`text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg -mt-8 transition-transform hover:scale-105 ${activeMenu === 'SCAN' ? 'bg-orange-500 shadow-orange-500/40' : 'bg-blue-600 shadow-blue-500/40'}`}>
            <QrCode className="w-7 h-7" />
          </button>

          <button onClick={() => setActiveMenu('RIWAYAT')} className={`flex flex-col items-center ${activeMenu === 'RIWAYAT' ? 'text-blue-600' : 'text-gray-400'}`}>
            <FileText className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Riwayat</span>
          </button>
        </div>

      </main>
    </div>
  );
};

export default UserLayout;