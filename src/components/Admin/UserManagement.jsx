import React, { useState, useEffect } from "react";
import { UserPlus, Trash2, Edit3, Loader2, X, Eye, EyeOff } from "lucide-react";

const UserManagement = ({ SCRIPT_URL }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    identitas: "",
    password: "",
  });

  const [notif, setNotif] = useState({
    show: false,
    pesan: "",
    tipe: "success",
  });

  const tampilNotif = (pesan, tipe = "success") => {
    setNotif({ show: true, pesan, tipe });

    setTimeout(() => {
      setNotif({ show: false, pesan: "", tipe: "success" });
    }, 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SCRIPT_URL}?action=getUsers`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      tampilNotif("Gagal mengambil data!", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.identitas) {
      tampilNotif("Lengkapi data!", "error");
      return;
    }

    setLoading(true);

    try {
      const body = {
        action: isEditing ? "updateUser" : "register",
        ...formData,
      };

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(body),
      });

      tampilNotif(
        isEditing
          ? "Data berhasil diperbarui!"
          : "Karyawan berhasil ditambahkan!",
      );

      setShowModal(false);
      setIsEditing(false);

      setFormData({
        id: "",
        nama: "",
        identitas: "",
        password: "",
      });

      setTimeout(fetchUsers, 2000);
    } catch (err) {
      tampilNotif("Terjadi kesalahan server!", "error");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus karyawan ini?")) return;

    setLoading(true);

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          action: "deleteUser",
          id: id,
        }),
      });

      tampilNotif("Karyawan berhasil dihapus");

      setTimeout(fetchUsers, 2000);
    } catch {
      tampilNotif("Gagal menghapus!", "error");
    }

    setLoading(false);
  };

  const openEditModal = (user) => {
    setFormData({
      id: user.id,
      nama: user.nama,
      identitas: user.identitas,
      password: "",
    });

    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* NOTIFIKASI */}
      {/* NOTIFIKASI */}
      {notif.show && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none`}
        >
          <div
            className={`px-8 py-4 rounded-2xl font-bold text-white shadow-lg pointer-events-auto transition-all duration-300
      ${notif.tipe === "error" ? "bg-red-500" : "bg-green-500"}`}
          >
            {notif.pesan}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm">
        <h2 className="text-xl font-black italic uppercase">Kelola Karyawan</h2>

        <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex gap-2"
        >
          <UserPlus size={18} />
          Tambah
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase">
            <tr>
              <th className="p-5">Karyawan</th>
              <th className="p-5 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-5">
                  <p className="font-black italic text-gray-800 uppercase">
                    {u.nama}
                  </p>
                  <p className="text-xs text-blue-600 font-bold">
                    {u.id} • {u.identitas}
                  </p>
                </td>

                <td className="p-5 flex justify-center gap-3">
                  <button
                    onClick={() => openEditModal(u)}
                    className="p-2 bg-amber-50 text-amber-600 rounded-xl"
                  >
                    <Edit3 size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(u.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-[2.5rem] w-full max-w-md space-y-4 shadow-2xl"
          >
            <div className="flex justify-between">
              <h3 className="text-xl font-black italic uppercase">
                {isEditing ? "Edit" : "Tambah"} Karyawan
              </h3>

              <button type="button" onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <input
              type="text"
              placeholder="ID (PGW-01)"
              className="w-full p-4 bg-gray-50 rounded-xl"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              disabled={isEditing}
            />

            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full p-4 bg-gray-50 rounded-xl"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Username"
              className="w-full p-4 bg-gray-50 rounded-xl"
              value={formData.identitas}
              onChange={(e) =>
                setFormData({ ...formData, identitas: e.target.value })
              }
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-4 bg-gray-50 rounded-xl"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : isEditing ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Karyawan"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
