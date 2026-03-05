import React, { useState } from 'react';
import Auth from './components/Auth/Auth';
import AdminPage from './components/Admin/AdminPage';
import UserLayout from './components/Layout/UserLayout';

const App = () => {
  const [halaman, setHalaman] = useState("AUTH"); 
  const [userAktif, setUserAktif] = useState(null); 

  const handleLogin = (role, dataUser) => {
    setUserAktif(dataUser); 
    setHalaman(role);
  };

  const handleLogout = () => {
    setHalaman("AUTH");
    setUserAktif(null);
  };

  if (halaman === "ADMIN") {
    return <AdminPage onLogout={handleLogout} />;
  }

  // Jika rolenya PEGAWAI atau USER
  if (halaman === "PEGAWAI" || halaman === "USER") {
    return <UserLayout onLogout={handleLogout} user={userAktif} />;
  }

  return <Auth onLogin={handleLogin} />;
};

export default App;