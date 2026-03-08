import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Trash2, Edit3, Loader2, X, Eye, EyeOff, KeySquare, Save } from 'lucide-react';

const UserManagement = ({ SCRIPT_URL }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ id: '', nama: '', identitas: '', password: '' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SCRIPT_URL}?action=getUsers`);
      const data = await res.json();
      setUsers(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { action: isEditing ? "updateUser" : "register", ...formData };
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Gunakan no-cors untuk Google Script POST
        body: JSON.stringify(body)
      });
      alert("Proses Berhasil!");
      setShowModal(false);
      setIsEditing(false);
      setFormData({ id: '', nama: '', identitas: '', password: '' });
      setTimeout(fetchUsers, 1500);
    } catch (e) { alert("Gagal!"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus karyawan ini?")) return;
    setLoading(true);
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ action: "deleteUser", id })
    });
    setTimeout(fetchUsers, 1500);
  };

  return (
    <div className="p-6 text-left space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm">
        <h2 className="text-xl font-black italic uppercase italic">Kelola Karyawan</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
          <UserPlus size={18} /> Tambah
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border">
        <table className="w-full">
          <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
            <tr>
              <th className="p-5">Karyawan</th>
              <th className="p-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-5">
                  <p className="font-black uppercase italic text-gray-800">{u.nama}</p>
                  <p className="text-[10px] font-bold text-blue-600">{u.id} • {u.identitas}</p>
                </td>
                <td className="p-5 flex justify-center gap-2">
                  <button onClick={() => { setFormData(u); setIsEditing(true); setShowModal(true); }} className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Edit3 size={18}/></button>
                  <button onClick={() => handleDelete(u.id)} className="p-2 bg-red-50 text-red-600 rounded-xl"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between">
              <h3 className="text-xl font-black italic uppercase">{isEditing ? 'Edit' : 'Tambah'} Karyawan</h3>
              <button type="button" onClick={() => setShowModal(false)}><X/></button>
            </div>
            <input type="text" placeholder="ID (PGW-01)" className="w-full p-4 bg-gray-50 rounded-xl font-bold" value={formData.id} onChange={(e)=>setFormData({...formData, id:e.target.value})} disabled={isEditing} />
            <input type="text" placeholder="Nama Lengkap" className="w-full p-4 bg-gray-50 rounded-xl font-bold" value={formData.nama} onChange={(e)=>setFormData({...formData, nama:e.target.value})} />
            <input type="text" placeholder="Username" className="w-full p-4 bg-gray-50 rounded-xl font-bold" value={formData.identitas} onChange={(e)=>setFormData({...formData, identitas:e.target.value})} />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full p-4 bg-gray-50 rounded-xl font-bold" value={formData.password} onChange={(e)=>setFormData({...formData, password:e.target.value})} />
              <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest">
              {loading ? <Loader2 className="animate-spin mx-auto"/> : isEditing ? 'Simpan Perubahan' : 'Tambah Karyawan'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;