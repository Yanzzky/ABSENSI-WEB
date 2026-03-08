import React, { useState, useEffect } from 'react';
import Auth from './components/Auth/Auth';
import AdminPage from './components/Admin/AdminPage';
import UserLayout from './components/Layout/UserLayout';

const App = () => {
  // 1. Inisialisasi User secara instan dari sessionStorage (PER TAB)
  const [userAktif, setUserAktif] = useState(() => {
    const savedUser = sessionStorage.getItem("app_user");
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      return null;
    }
  });

  // 2. State halaman (Navigasi internal)
  const [halaman, setHalaman] = useState(() => {
    if (!userAktif) return "AUTH";
    return String(userAktif.role).toUpperCase() === "ADMIN" ? "ADMIN" : "USER";
  });

  // 3. Sinkronisasi Memori ke sessionStorage
  useEffect(() => {
    if (userAktif) {
      sessionStorage.setItem("app_user", JSON.stringify(userAktif));
    }
  }, [userAktif]);

  // 4. Fungsi Login
  const handleLogin = (role, dataUser) => {
    const roleFix = String(role).toUpperCase();
    const fullData = { ...dataUser, role: roleFix };
    
    // Simpan ke sessionStorage agar terisolasi di tab ini saja
    sessionStorage.setItem("app_user", JSON.stringify(fullData));
    setUserAktif(fullData);
    setHalaman(roleFix === "ADMIN" ? "ADMIN" : "USER");
  };

  // 5. Fungsi Logout
  const handleLogout = () => {
    sessionStorage.removeItem("app_user");
    sessionStorage.removeItem("activeAdminMenu");
    setUserAktif(null);
    setHalaman("AUTH");
  };

  // --- LOGIKA RENDER (PENJAGA PINTU) ---

  // Jika tidak ada data user, tampilkan halaman Login
  if (!userAktif || halaman === "AUTH") {
    return <Auth onLogin={handleLogin} />;
  }

  // Cek Role ADMIN
  if (String(userAktif.role).toUpperCase() === "ADMIN") {
    return <AdminPage user={userAktif} onLogout={handleLogout} />;
  }

  // Cek Role USER/PEGAWAI
  return <UserLayout user={userAktif} onLogout={handleLogout} />;
};

export default App;