import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Search, Trash2, UserCheck, 
  Loader2, Plus, X, Shield, Fingerprint, KeySquare
} from 'lucide-react';

const UserManagement = ({ SCRIPT_URL }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State Form Tambah Karyawan
  const [formData, setFormData] = useState({
    id: '',
    nama: '',
    identitas: '',
    password: '',
  });

  // 1. AMBIL DATA KARYAWAN
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SCRIPT_URL}?action=getUsers&_t=${new Date().getTime()}`);
      const data = await response.json();
      // Filter hanya yang rolenya PEGAWAI atau USER (bukan ADMIN)
      const employeeOnly = data.filter(u => String(u.role).toUpperCase() !== "ADMIN");
      setUsers(employeeOnly);
    } catch (error) {
      console.error("Gagal load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. SIMPAN KARYAWAN BARU
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.nama || !formData.identitas || !formData.password) {
      return alert("Mohon isi semua data!");
    }

    setLoading(true);
    try {
      const payload = {
        action: "register",
        ...formData
      };

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });

      alert("✅ Karyawan berhasil ditambahkan!");
      setShowModal(false);
      setFormData({ id: '', nama: '', identitas: '', password: '' });
      setTimeout(fetchUsers, 2000); // Refresh data
    } catch (error) {
      alert("❌ Gagal menambah data.");
    } finally {
      setLoading(false);
    }
  };

  // Filter pencarian
  const filteredUsers = users.filter(u => 
    u.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari Nama atau ID Karyawan..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          <UserPlus size={18} /> Tambah Karyawan
        </button>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Karyawan</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID System</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Username</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={32} />
                    <p className="text-sm font-bold text-gray-400">Menghubungkan ke Database...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold">Data tidak ditemukan</td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">
                          {u.nama?.substring(0,2).toUpperCase()}
                        </div>
                        <p className="font-bold text-gray-800 tracking-tight capitalize">{u.nama}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-xs font-black text-blue-600">{u.id}</td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-500">{u.identitas}</td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Aktif</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH DATA */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-800">Registrasi Karyawan</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="relative">
                <Fingerprint className="absolute left-4 top-4 text-gray-400" size={20} />
                <input 
                  type="text" placeholder="ID Karyawan (Contoh: PGW-01)"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                  value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})}
                />
              </div>

              <div className="relative">
                <UserPlus className="absolute left-4 top-4 text-gray-400" size={20} />
                <input 
                  type="text" placeholder="Nama Lengkap Karyawan"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                  value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})}
                />
              </div>

              <div className="relative">
                <Shield className="absolute left-4 top-4 text-gray-400" size={20} />
                <input 
                  type="text" placeholder="Username / Identitas Login"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                  value={formData.identitas} onChange={(e) => setFormData({...formData, identitas: e.target.value})}
                />
              </div>

              <div className="relative">
                <KeySquare className="absolute left-4 top-4 text-gray-400" size={20} />
                <input 
                  type="password" placeholder="Password Awal"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mt-4 hover:bg-blue-700 active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Tambahkan Sekarang</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;