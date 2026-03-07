import React, { useState, useEffect } from 'react';
import { 
  Database, Download, Loader2, 
  Users, UserRound, Search, RefreshCw 
} from 'lucide-react';
import * as XLSX from 'xlsx';

const EmployeeData = ({ SCRIPT_URL }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmployees = async () => {
    if (!SCRIPT_URL) return;
    try {
      setLoading(true);
      const response = await fetch(`${SCRIPT_URL}?action=getUsers&_t=${new Date().getTime()}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Filter: Hanya ambil yang bukan Admin
        const filtered = data.filter(u => String(u.role).toUpperCase() !== "ADMIN");
        setEmployees(filtered);
      }
    } catch (error) {
      console.error("Gagal load data induk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [SCRIPT_URL]);

  const exportToExcel = () => {
    if (employees.length === 0) {
      alert("⚠️ Datanya masih kosong bang, belum ada yang bisa di-export.");
      return;
    }
    
    // Siapkan data: Hapus kolom password & rapikan nama kolom untuk Excel
    const dataForExcel = employees.map((emp, index) => ({
      "No": index + 1,
      "ID Karyawan": emp.id,
      "Nama Lengkap": emp.nama,
      "Username/Identitas": emp.identitas,
      "Jabatan/Role": emp.role || "PEGAWAI"
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Database_Karyawan");
    
    // Download file
    XLSX.writeFile(wb, `Data_Induk_Karyawan_${new Date().toLocaleDateString('id-ID')}.xlsx`);
    alert("✅ Berhasil! Cek folder download abang.");
  };

  const displayData = employees.filter(emp => 
    (emp.nama?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.id?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100">
            <Database size={24} />
          </div>
          <div>
            <h3 className="font-black text-gray-800 uppercase tracking-tighter italic leading-none">Data Induk Karyawan</h3>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Database Centralized System</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={fetchEmployees}
            className="p-2.5 bg-gray-50 text-gray-400 hover:text-emerald-600 rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" placeholder="Cari..." 
              className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={exportToExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-100 active:scale-95 transition-all"
          >
            <Download size={16}/> Export Excel
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Users size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Karyawan</p>
            <h4 className="text-2xl font-black text-gray-800 tracking-tighter">
              {loading ? "..." : employees.length} <span className="text-xs text-gray-400">Jiwa</span>
            </h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><UserRound size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Terfilter</p>
            <h4 className="text-2xl font-black text-gray-800 tracking-tighter">{displayData.length}</h4>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">ID Karyawan</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">Nama Lengkap</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">Username</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-600" /></td>
                </tr>
              ) : displayData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-gray-400 font-bold italic">Belum ada data pegawai...</td>
                </tr>
              ) : (
                displayData.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 font-mono text-xs font-black text-emerald-600 uppercase tracking-tighter">{emp.id}</td>
                    <td className="px-8 py-5 font-bold text-gray-700 capitalize">{emp.nama}</td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-medium italic">{emp.identitas}</td>
                    <td className="px-8 py-5 text-center">
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100 tracking-widest">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeData;