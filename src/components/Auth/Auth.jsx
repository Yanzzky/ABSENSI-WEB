import React, { useState } from 'react';
import { User, Lock, AtSign, CheckCircle } from 'lucide-react';
import laptopImg from "../../assets/images/Latop.png";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz7nRKHVoWoFBhBp67J-EZUFN4WcKlMqATh19Q9CcWq4vIGqd3r9t91xSr-6uafAxU/exec"; 

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); 
  const [nama, setNama] = useState("");
  const [identitas, setIdentitas] = useState(""); 
  const [password, setPassword] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPesan("");

    if (isLogin) {
      if (identitas === "admin" && password === "admin123") {
        return onLogin("ADMIN", { id: "ADM-001", nama: "Administrator", identitas: "admin" });
      }
      
      setLoading(true);
      setPesan("Memverifikasi data...");
      
      try {
        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify({ action: "login", identitas: identitas, password: password })
        });
        const result = await response.json();

        if (result.status === "success") {
          onLogin(result.role, { id: result.id, nama: result.nama, identitas: result.identitas });
        } else {
          setPesan("❌ " + result.message);
        }
      } catch (error) {
        setPesan("❌ Terjadi kesalahan jaringan.");
      }
      setLoading(false);

    } else {
      if (!nama || !identitas || !password) return setPesan("Semua kolom wajib diisi!");
      setLoading(true);
      setPesan("Mendaftarkan akun...");

      try {
        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify({
            action: "register",
            id: "PGW-" + Math.floor(Math.random() * 10000), 
            nama: nama,
            identitas: identitas,
            password: password,
            role: "PEGAWAI" 
          })
        });
        const result = await response.json();

        if (result.status === "success") {
          setShowSuccessModal(true);
        } else {
          setPesan("❌ " + result.message);
        }
      } catch (error) {
        setPesan("❌ Terjadi kesalahan jaringan.");
      }
      setLoading(false);
    }
  };

  const handleTutupModal = () => {
    setShowSuccessModal(false);
    setIsLogin(true); 
    setPassword(""); 
  };

  return (
    <div className="w-screen h-screen bg-[#e8f0fe] flex items-center justify-center p-0 md:p-4 font-sans relative overflow-hidden">
      
      {/* Efek Background Luar Desktop */}
      <div className="hidden md:block absolute inset-0 bg-blue-100 mix-blend-multiply filter blur-3xl opacity-50"></div>
      
      {/* POP-UP MODAL SUKSES REGISTER */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center transform transition-all scale-100 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Berhasil!</h3>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              Akun <b className="text-gray-700">{nama}</b> telah siap. Silakan masuk menggunakan identitas yang telah Anda daftarkan.
            </p>
            <button
              onClick={handleTutupModal}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1"
            >
              Lanjut ke Login
            </button>
          </div>
        </div>
      )}

      {/* Kontainer Utama */}
      <div className="bg-white w-full h-full md:h-auto md:rounded-[2rem] md:shadow-2xl max-w-5xl flex flex-col md:flex-row relative z-10 md:min-h-[600px] overflow-x-hidden md:overflow-hidden">
        
        {/* Form Area Kiri */}
        <div className="w-full md:w-[45%] p-8 md:p-12 flex-1 flex flex-col justify-center mt-2 md:mt-0 z-10 bg-white">
          <div className="max-w-xs mx-auto w-full -mt-2">
            <div className="flex gap-8 mb-8 border-b-2 border-gray-100">
              <button onClick={() => { setIsLogin(true); setPesan(""); }} className={`pb-2 text-xl font-bold relative ${isLogin ? 'text-blue-600' : 'text-gray-300'}`}>
                Login
                {isLogin && <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-blue-600 transition-all"></span>}
              </button>
              <button onClick={() => { setIsLogin(false); setPesan(""); }} className={`pb-2 text-xl font-bold relative ${!isLogin ? 'text-blue-600' : 'text-gray-300'}`}>
                Sign up
                {!isLogin && <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-blue-600 transition-all"></span>}
              </button>
            </div>  

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-blue-600" />
                  <input type="text" placeholder="Nama Lengkap" value={nama} onChange={(e) => setNama(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-full focus:outline-none focus:border-blue-400 text-sm transition-colors" />
                </div>
              )}

              <div className="relative">
                <AtSign className="absolute left-4 top-3.5 h-5 w-5 text-blue-600" />
                <input type="text" placeholder="Email atau NIP" value={identitas} onChange={(e) => setIdentitas(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-full focus:outline-none focus:border-blue-400 text-sm transition-colors" />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-blue-600" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-full focus:outline-none focus:border-blue-400 text-sm transition-colors" />
              </div>

              {pesan && <p className={`text-xs font-medium pl-4 ${pesan.includes('❌') ? 'text-red-500' : 'text-blue-500'}`}>{pesan}</p>}

              <div className="flex items-center justify-between pt-4">
                {isLogin ? <a href="#" className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors">Forgot password?</a> : <div></div>}
                <button disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none">
                  {loading ? 'Memproses...' : (isLogin ? 'Login' : 'Sign up')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Gambar Ilustrasi Kanan */}
        <div className="w-full md:w-[55%] relative bg-white order-first md:order-last h-[250px] md:h-auto shrink-0">
          
          {/* ======================================= */}
          {/* 1. TAMPILAN MOBILE (Hanya 1 Lapis Biru) */}
          {/* ======================================= */}
          <div className="md:hidden absolute top-0 right-0 w-full h-full bg-[#4fc3f7] rounded-b-[2.5rem] flex justify-center items-center">
            <img
              src={laptopImg}
              alt="Laptop"
              className="h-[180px] w-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* ======================================= */}
          {/* 2. TAMPILAN DESKTOP (3 Lapis Bergelombang) */}
          {/* ======================================= */}
          <div className="hidden md:block absolute top-0 right-0 w-full h-full">
            
            {/* Lapis 1 (Paling Belakang - Biru Sangat Muda) */}
            <div className="absolute top-[-20%] right-[-10%] w-[130%] h-[140%] bg-blue-50 rounded-l-full"></div>
            
            {/* Lapis 2 (Tengah - Biru Muda) */}
            <div className="absolute top-[-5%] right-[-5%] w-[105%] h-[110%] bg-blue-100 rounded-l-full"></div>
            
            {/* Lapis 3 (Paling Depan - Biru Utama + Gambar) */}
            <div className="absolute top-[12%] right-0 w-[85%] h-[76%] bg-[#4fc3f7] rounded-l-full flex justify-center items-center shadow-md">
              <img
                src={laptopImg}
                alt="Laptop"
                className="w-[65%] object-contain drop-shadow-2xl ml-8 hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;