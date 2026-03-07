import React, { useState, useEffect } from "react";
import {
  ShieldCheck, Mail, IdCard, Key, Lock,
  CheckCircle2, Save, X, Eye, EyeOff, Loader2,
} from "lucide-react";

const AdminProfile = ({ user, SCRIPT_URL }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  // 🔄 Ambil data terbaru dari Google Sheet
  const refreshUserData = async () => {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getUsers&_t=${new Date().getTime()}`);
      const allUsers = await response.json();

      const updatedData = allUsers.find(
        (u) => String(u.id).trim() === String(user?.id).trim()
      );

      if (updatedData) {
        setCurrentUser(updatedData);
      }
    } catch (error) {
      console.error("Gagal sinkronisasi profil:", error);
    }
  };

  // Efek untuk sinkronisasi awal
  useEffect(() => {
    if (user?.id) {
      refreshUserData();
    }
  }, [user?.id]);

  // 🔐 Ganti Password
  const handleChangePassword = async () => {
    const targetId = currentUser?.id || user?.id;

    if (!targetId) {
      alert("ID user tidak ditemukan. Silakan refresh halaman.");
      return;
    }

    if (!newPassword.trim() || newPassword.length < 5) {
      alert("Password minimal 5 karakter!");
      return;
    }

    try {
      setLoading(true);

      // KUNCI: Gunakan mode 'no-cors' agar tidak diblokir browser
      // Kita kirim sebagai string JSON tapi lewat text/plain
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          action: "updatePassword",
          id: String(targetId).trim(),
          newPassword: newPassword.trim(),
        }),
      });

      // Karena no-cors tidak bisa baca response, kita asumsikan berhasil jika tidak masuk catch
      alert("✅ Permintaan ganti password dikirim! Silakan cek Sheets atau coba login ulang.");
      setShowModal(false);
      setNewPassword("");
      
      // Tunggu sebentar lalu refresh data lokal
      setTimeout(refreshUserData, 2000);

    } catch (error) {
      console.error("ERROR UPDATE:", error);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left animate-in fade-in duration-500">
      {/* CARD PROFIL */}
      <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-6 border-b border-gray-50 pb-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {(currentUser?.nama || user?.nama || "AD").substring(0, 2).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight italic uppercase">
              {currentUser?.nama || user?.nama || "Administrator"}
            </h2>

            <div className="flex gap-2 mt-2">
              <span className="bg-blue-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                {currentUser?.role || user?.role || "ADMIN"}
              </span>

              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified
              </span>
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Username / Identitas</label>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-transparent font-bold text-gray-700">
              <Mail size={18} className="text-blue-500" />
              {currentUser?.identitas || user?.identitas}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Admin ID System</label>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-transparent font-bold text-gray-700">
              <IdCard size={18} className="text-blue-500" />
              {currentUser?.id || user?.id}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-8 bg-gray-900 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
        >
          <Key size={18} /> Ganti Password Akses
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black italic uppercase text-xl tracking-tight">Ubah Password</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password baru..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Update Password</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INFO SECURITY */}
      <div className="bg-blue-50/50 p-6 rounded-[1.5rem] flex items-start gap-4 border border-blue-100">
        <ShieldCheck className="text-blue-600 shrink-0" size={24} />
        <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
          Sistem keamanan terenkripsi. Perubahan password akan langsung diterapkan ke database Google Sheets. 
          Jika terjadi kendala, pastikan ID Admin Anda sesuai dengan data di pusat.
        </p>
      </div>
    </div>
  );
};

export default AdminProfile;