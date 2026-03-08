import React, { useState, useEffect, useCallback } from "react";
import {
  LogOut, LayoutDashboard, Users, UserCog, Database, Settings,
  FileText, History, Menu, X, Loader2
} from "lucide-react";

// IMPORT MODUL
import UserManagement from "./UserManagement";
import AttendanceRecord from "./AttendanceRecord";
import SystemSettings from "./SystemSettings";
import AdminProfile from "./AdminProfile";
import EmployeeData from "./EmployeeData";
import ActivityLog from "./ActivityLog";
import DashboardHome from "./DashboardAdmin";

const AdminPage = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ totalKaryawan: 0, hadirHariIni: 0 });
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL SCRIPT GOOGLE
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzqg0NUfUh-_TgTpG-ITdRQkmR8JcJa59OG2YV6ZhOIx0tH4MvudvFjUb6M5gYCmCVL/exec";

  const QR_DATA = "KANTOR-PUSAT-123";
  const QR_IMAGE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${QR_DATA}`;

  const menuItems = [
    {
      group: "Wajib",
      items: [
        { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Manajemen User", icon: <Users size={20} /> },
        { name: "Profil Admin", icon: <UserCog size={20} /> },
      ],
    },
    {
      group: "Data Presensi",
      items: [
        { name: "Data Karyawan", icon: <Database size={20} /> },
        { name: "Rekap Absensi", icon: <FileText size={20} /> },
      ],
    },
    {
      group: "Sistem",
      items: [
        { name: "Pengaturan", icon: <Settings size={20} /> },
        { name: "Log Aktivitas", icon: <History size={20} /> },
      ],
    },
  ];

  // FUNGSI SINKRONISASI DATA (GET DASHBOARD & USERS)
  const syncData = useCallback(
    async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);

        // 1. Ambil Data Presensi (Default Action)
        const response = await fetch(`${SCRIPT_URL}?_t=${Date.now()}`, {
            method: "GET",
            redirect: "follow" // WAJIB ADA AGAR DATA MUNCUL
        });
        const data = await response.json();

        // 2. Ambil Data Users untuk Statistik
        const resUser = await fetch(`${SCRIPT_URL}?action=getUsers&_t=${Date.now()}`, {
            method: "GET",
            redirect: "follow" // WAJIB ADA AGAR DATA MUNCUL
        });
        const dataUsers = await resUser.json();

        if (Array.isArray(data)) {
          setRawData(data);
          const totalTerdaftar = Array.isArray(dataUsers) ? dataUsers.length : 0;

          // Logika Hitung Hadir Hari Ini
          const d = new Date();
          const hari = ("0" + d.getDate()).slice(-2);
          const bulanIndo = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
          const tglSekarang = `${hari} ${bulanIndo[d.getMonth()]} ${d.getFullYear()}`;

          const jumlahHadir = data.filter((item) => {
            const tglSheet = String(item.tanggal || "").trim();
            const tipeAbsen = String(item.tipe || "").toUpperCase();
            return tglSheet === tglSekarang && tipeAbsen === "MASUK";
          }).length;

          setStats({
            totalKaryawan: totalTerdaftar,
            hadirHariIni: jumlahHadir,
          });
        }
      } catch (error) {
        console.error("Gagal Sinkronisasi Dashboard:", error);
      } finally {
        setLoading(false);
      }
    },
    [SCRIPT_URL]
  );

  useEffect(() => {
    syncData();
    const interval = setInterval(() => syncData(true), 15000);
    return () => clearInterval(interval);
  }, [syncData]);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans relative overflow-hidden text-left">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] bg-white border-r border-gray-200 transition-all duration-300 transform 
        ${isSidebarOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:w-64"} lg:static flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between border-b">
          <h1 className="font-black text-xl text-blue-600 italic tracking-tighter uppercase leading-none">
            Admin Panel
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-gray-400"><X size={20} /></button>
        </div>

        <nav className="flex-1 px-4 mt-6 overflow-y-auto">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 px-3 tracking-widest text-left">
                {section.group}
              </p>
              {section.items.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveMenu(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl mb-1 transition-all ${
                    activeMenu === item.name 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                    : "text-gray-500 hover:bg-blue-50"
                  }`}
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
            className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold text-sm transition-colors"
          >
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 lg:hidden bg-blue-50 text-blue-600 rounded-2xl"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-black text-gray-800 tracking-tight italic uppercase">
              {activeMenu}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Administrator</p>
              <p className="text-sm font-black text-gray-800">{user?.nama || "Admin"}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black border-2 border-white shadow-md">
              {user?.nama ? user.nama.substring(0, 2).toUpperCase() : "AD"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          {activeMenu === "Dashboard" && (
            <DashboardHome stats={stats} loading={loading} QR_IMAGE_URL={QR_IMAGE_URL} QR_DATA={QR_DATA} user={user} />
          )}
          {activeMenu === "Manajemen User" && <UserManagement SCRIPT_URL={SCRIPT_URL} />}
          {activeMenu === "Rekap Absensi" && <AttendanceRecord SCRIPT_URL={SCRIPT_URL}/>}
          {activeMenu === "Profil Admin" && <AdminProfile user={user} SCRIPT_URL={SCRIPT_URL} />}
          {activeMenu === "Data Karyawan" && <EmployeeData SCRIPT_URL={SCRIPT_URL} />}
          {activeMenu === "Pengaturan" && <SystemSettings />}
          {activeMenu === "Log Aktivitas" && <ActivityLog SCRIPT_URL={SCRIPT_URL}/>}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;