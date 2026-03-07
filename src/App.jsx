import React, { useState, useEffect } from 'react';
import Auth from './components/Auth/Auth';
import AdminPage from './components/Admin/AdminPage';
import UserLayout from './components/Layout/UserLayout';

const App = () => {
  // 1. Ambil data user duluan dari memori
  const [userAktif, setUserAktif] = useState(() => {
    const savedUser = localStorage.getItem("app_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Tentukan halaman berdasarkan ROLE user yang ada di memori
  const [halaman, setHalaman] = useState(() => {
    const savedUser = localStorage.getItem("app_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // Kalau rolenya ADMIN, paksa ke halaman ADMIN
      return parsed.role === "ADMIN" ? "ADMIN" : "USER";
    }
    return "AUTH";
  });

  // 3. Sinkronisasi memori setiap kali ada perubahan
  useEffect(() => {
    if (userAktif) {
      localStorage.setItem("app_user", JSON.stringify(userAktif));
      localStorage.setItem("app_halaman", halaman);
    } else {
      localStorage.removeItem("app_user");
      localStorage.removeItem("app_halaman");
      localStorage.removeItem("activeAdminMenu");
    }
  }, [userAktif, halaman]);

  const handleLogin = (role, dataUser) => {
    setUserAktif(dataUser);
    // Pastikan role yang dikirim dari Google Apps Script adalah "ADMIN" (huruf besar)
    const targetHalaman = String(dataUser.role).toUpperCase() === "ADMIN" ? "ADMIN" : "USER";
    setHalaman(targetHalaman);
  };

  const handleLogout = () => {
    setUserAktif(null);
    setHalaman("AUTH");
  };

  // --- LOGIKA RENDER (PENJAGA PINTU) ---
  
  // Jika belum login, tampilkan halaman Auth
  if (halaman === "AUTH" || !userAktif) {
    return <Auth onLogin={handleLogin} />;
  }

  // Jika Login sebagai ADMIN
  if (halaman === "ADMIN" && userAktif.role === "ADMIN") {
    return <AdminPage user={userAktif} onLogout={handleLogout} />;
  }

  // Jika selain itu, tampilkan halaman USER/PEGAWAI
  return <UserLayout onLogout={handleLogout} user={userAktif} />;
};

export default App;