import React, { useState } from 'react';
import { Lock, AtSign, Eye, EyeOff } from 'lucide-react'; // Tambahkan Eye & EyeOff
import laptopImg from "../../assets/images/Latop.png";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw_TwFlUCgqRExJlu05CoOEq-_-0PsY-KydZEM-0OcfXKbCYWvXmu5hlAaN71LIwUZ6/exec"; 

const Auth = ({ onLogin }) => {
  const [identitas, setIdentitas] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk kontrol mata
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identitas || !password) return setPesan("❌ Masukkan ID dan Password!");
    
    setPesan("");
    setLoading(true);

// ... kode lainnya tetap ...

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "login", identitas, password })
      });
      const result = await response.json();

      if (result.status === "success") {
        // --- MASUKKAN KODE INI DI SINI ---
        const sessionData = {
          role: result.role,
          id: result.id,
          nama: result.nama,
          identitas: result.identitas
        };
        // Simpan ke memori browser agar saat refresh tidak hilang
// Di Auth.jsx (WAJIB SAMA dengan App.jsx)
localStorage.setItem("app_user", JSON.stringify(sessionData));
        
        // Panggil fungsi onLogin bawaanmu
        onLogin(result.role, result);
        // ---------------------------------
      } else {
        setPesan("❌ " + result.message);
      }
    } catch (error) {
      setPesan("❌ Gagal terhubung ke server.");
    }
  }

// ... kode lainnya tetap ...

  return (
    <div className="w-screen h-screen bg-[#e8f0fe] flex items-center justify-center font-sans relative overflow-hidden">
      <div className="bg-white w-full h-full md:h-auto md:rounded-[2.5rem] md:shadow-2xl max-w-5xl flex flex-col md:flex-row relative z-10 md:min-h-[600px] overflow-hidden">
        
        {/* ILUSTRASI MOBILE */}
        <div className="md:hidden w-full bg-[#4fc3f7] py-8 flex justify-center items-center rounded-b-[3rem] shadow-lg">
            <img src={laptopImg} alt="Laptop" className="w-40 drop-shadow-xl animate-pulse" />
        </div>

        {/* FORM LOGIN AREA */}
        <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-4xl font-black text-blue-600 italic tracking-tighter uppercase leading-none">PresensiKu</h2>
              <p className="text-gray-400 text-[10px] mt-4 font-black uppercase tracking-[0.2em]">Portal Absensi Digital</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-4 mb-1 block">ID Pengguna</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-4 h-5 w-5 text-blue-600" />
                  <input 
                    type="text" 
                    placeholder="ID Karyawan / Admin" 
                    value={identitas} 
                    onChange={(e) => setIdentitas(e.target.value)} 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-white text-sm transition-all font-bold" 
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-4 mb-1 block">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-blue-600" />
                  <input 
                    type={showPassword ? "text" : "password"} // Tipe input berubah dinamis
                    placeholder="Masukkan Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full pl-12 pr-14 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-white text-sm transition-all font-bold" 
                  />
                  {/* TOMBOL MATA */}
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {pesan && (
                <div className="bg-red-50 text-red-600 text-[11px] font-bold p-3 rounded-xl border border-red-100">
                  {pesan}
                </div>
              )}

              <button 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all transform active:scale-95 disabled:opacity-50 mt-2"
              >
                {loading ? 'MEMVERIFIKASI...' : 'MASUK SEKARANG'}
              </button>
            </form>
          </div>
        </div>

        {/* ILLUSTRASI DESKTOP */}
        <div className="hidden md:flex w-[55%] relative bg-[#4fc3f7] rounded-l-[5rem] shadow-inner items-center justify-center">
            <img src={laptopImg} alt="Laptop" className="w-[70%] drop-shadow-2xl animate-pulse duration-[3s]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;