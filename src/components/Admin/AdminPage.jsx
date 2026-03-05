import React, { useState, useEffect } from 'react';
import { 
  LogOut, QrCode, LayoutDashboard, Users, UserCog, 
  Database, Settings, FileText, Bell, History, Menu, X,
  CalendarCheck, Loader2
} from 'lucide-react';

import UserManagement from './UserManagement';
import AttendanceRecord from './AttendanceRecord';
import SystemSettings from './SystemSettings';
import AdminProfile from './AdminProfile';
import EmployeeData from './EmployeeData';
import ActivityLog from './ActivityLog';

const AdminPage = ({ user, onLogout }) => {

  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ totalKaryawan: 0, hadirHariIni: 0 });
  const [loading, setLoading] = useState(true);

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxDRTdRWbR8HITw5bKomQFdNEkxSo8o51UvXXm2TazEY4mDTQvWL1HnTKGEph08fRvZ/exec";

  const QR_DATA = "KANTOR-PUSAT-123";
  const QR_IMAGE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${QR_DATA}`;

  const menuItems = [
    { group: 'Wajib', items: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { name: 'Manajemen User', icon: <Users size={20} /> },
      { name: 'Profil Admin', icon: <UserCog size={20} /> },
    ]},

    { group: 'Data Presensi', items: [
      { name: 'Data Karyawan', icon: <Database size={20} /> },
      { name: 'Rekap Absensi', icon: <FileText size={20} /> },
    ]},

    { group: 'Sistem', items: [
      { name: 'Pengaturan', icon: <Settings size={20} /> },
      { name: 'Log Aktivitas', icon: <History size={20} /> },
    ]}
  ];

  useEffect(() => {

    const fetchStats = async () => {
      try {

        setLoading(true);

        const response = await fetch(SCRIPT_URL);
        const data = await response.json();

        if (Array.isArray(data)) {

          const listKaryawan = new Set(data.map(item => item.id));

          const jumlahHadirHariIni = data.filter(item => {

            const tglSheet = String(item.tanggal).trim();
            const tipeAbsen = String(item.tipe).trim().toUpperCase();

            const isHariIni = tglSheet.includes("Mar") && tglSheet.includes("2026");
            const isMasuk = tipeAbsen === "MASUK";

            return isHariIni && isMasuk;

          }).length;

          setStats({
            totalKaryawan: listKaryawan.size,
            hadirHariIni: jumlahHadirHariIni
          });

        }

      } catch (error) {

        console.error("Gagal ambil data:", error);

      } finally {

        setLoading(false);

      }

    };

    if (activeMenu === 'Dashboard') fetchStats();

  }, [activeMenu]);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans relative overflow-hidden">

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-[70] bg-white border-r border-gray-200 transition-all duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:w-64'} lg:static`}>

        <div className="p-6 flex items-center justify-between border-b border-gray-50">

          <h1 className="font-black text-xl text-blue-600 tracking-tighter italic">
            ADMIN PANEL
          </h1>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20}/>
          </button>

        </div>

        <nav className="flex-1 px-4 mt-6 overflow-y-auto pb-10">

          {menuItems.map((section, idx) => (

            <div key={idx} className="mb-6">

              <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 px-3 tracking-widest">
                {section.group}
              </p>

              {section.items.map((item) => (

                <button
                  key={item.name}
                  onClick={() => {
                    setActiveMenu(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl mb-1 transition-all
                  ${activeMenu === item.name
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-500 hover:bg-blue-50'}`}
                >
                  {item.icon}
                  <span className="text-sm font-bold">{item.name}</span>
                </button>

              ))}

            </div>

          ))}

        </nav>

        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold text-sm"
          >
            <LogOut size={20} /> Keluar
          </button>
        </div>

      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 shrink-0">

          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 lg:hidden bg-blue-50 text-blue-600 rounded-2xl"
            >
              <Menu size={24}/>
            </button>

            <h2 className="text-xl font-black text-gray-800">
              {activeMenu}
            </h2>

          </div>

          <div className="flex items-center gap-4">

            <button className="p-2.5 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-full transition-all relative">
              <Bell size={20}/>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black border-2 border-white shadow-md">
              {user?.nama ? user.nama.substring(0,2).toUpperCase() : "AD"}
            </div>

          </div>

        </header>

        <main className="p-4 lg:p-10 overflow-y-auto bg-gray-50 flex-1">

          {activeMenu === 'Dashboard' && (
            <div>Dashboard Content</div>
          )}

          {activeMenu === 'Manajemen User' && (
            <UserManagement/>
          )}

          {activeMenu === 'Profil Admin' && (
            <AdminProfile/>
          )}

          {activeMenu === 'Data Karyawan' && (
            <EmployeeData/>
          )}

          {activeMenu === 'Rekap Absensi' && (
            <AttendanceRecord/>
          )}

          {activeMenu === 'Pengaturan' && (
            <SystemSettings/>
          )}

          {activeMenu === 'Log Aktivitas' && (
            <ActivityLog/>
          )}

        </main>

      </div>

    </div>
  );
};

export default AdminPage;