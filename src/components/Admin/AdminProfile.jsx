import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Mail,
  IdCard,
  Key,
  Lock,
  CheckCircle2,
  Save,
  X,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

const AdminProfile = ({ user, SCRIPT_URL }) => {
  console.log("USER DARI PROPS:", user);
  console.log("USER MASUK KE PROFILE:", user);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 🔄 Sinkronkan user dari props
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  // 🔄 Ambil data terbaru dari Google Sheet
  const refreshUserData = async () => {
    try {

      const response = await fetch(
        `${SCRIPT_URL}?action=getUsers&_t=${Date.now()}`
      );

      const allUsers = await response.json();

      const updatedData = allUsers.find(
        (u) =>
          String(u.id).toLowerCase() ===
          String(currentUser?.id).toLowerCase()
      );

      if (updatedData) {
        setCurrentUser(updatedData);
      }

      console.log("USER LOGIN:", user);
      console.log("USER DARI SHEET:", updatedData);

    } catch (error) {
      console.error("Gagal sinkronisasi profil:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshUserData();
    }
  }, [currentUser?.id]);

  // 🔐 Ganti Password
  const handleChangePassword = async () => {

    if (!currentUser || !currentUser.id) {
      alert("ID user tidak ditemukan");
      console.log("CURRENT USER:", currentUser);
      return;
    }

    if (!newPassword.trim()) {
      alert("Password tidak boleh kosong");
      return;
    }

    try {

      setLoading(true);

      console.log("ID DIKIRIM:", currentUser.id);
      console.log("PASSWORD BARU:", newPassword);

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updatePassword",
          id: currentUser.id,
          newPassword: newPassword
        })
      });

      const result = await response.json();

      console.log("RESPON UPDATE:", result);

      if (result.status === "success") {

        alert("Password berhasil diubah");

        setShowModal(false);
        setNewPassword("");

        refreshUserData();

      } else {

        alert(result.message || "Gagal mengubah password");

      }

    } catch (error) {

      console.error("ERROR UPDATE:", error);
      alert("Terjadi kesalahan server");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">

      {/* CARD PROFIL */}
      <div className="bg-white rounded-3xl p-10 shadow border">

        <div className="flex items-center gap-6 border-b pb-8">

          <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {(currentUser?.nama || "AD").substring(0,2).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {currentUser?.nama || "Administrator"}
            </h2>

            <div className="flex gap-2 mt-2">
              <span className="bg-blue-600 text-white px-3 py-1 text-xs rounded-full">
                {currentUser?.role || "ADMIN"}
              </span>

              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 text-xs rounded-full flex items-center gap-1">
                <CheckCircle2 size={12}/> Verified
              </span>
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div>
            <label className="text-xs text-gray-400">Username</label>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
              <Mail size={16}/>
              {currentUser?.identitas}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400">Admin ID</label>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
              <IdCard size={16}/>
              {currentUser?.id}
            </div>
          </div>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-8 bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Key size={18}/> Ganti Password
        </button>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">

          <div className="bg-white p-8 rounded-3xl w-full max-w-md">

            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-lg">Ubah Password</h3>

              <button onClick={()=>setShowModal(false)}>
                <X/>
              </button>
            </div>

            <div className="relative mb-4">

              <Lock className="absolute left-3 top-3 text-gray-400"/>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password baru..."
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-xl outline-none"
              />

              <button
                onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff/> : <Eye/>}
              </button>

            </div>

            <button
              type="button"
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Save size={18} /> Simpan Password Baru
                </>
              )}
            </button>

          </div>

        </div>
      )}

      {/* INFO SECURITY */}
      <div className="bg-blue-50 p-4 rounded-xl flex gap-3">
        <ShieldCheck className="text-blue-600"/>
        <p className="text-xs text-blue-700">
          Sistem terhubung dengan Google Sheets. Pastikan ID Admin sesuai agar perubahan password berhasil.
        </p>
      </div>

    </div>
  );
};

export default AdminProfile;