import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Search, Loader2, RefreshCw, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';

const AttendanceRecord = ({ SCRIPT_URL }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(""); // Format: YYYY-MM-DD

  // 1. Ambil Data Absensi dari Google Sheets
  const fetchData = async () => {
    try {
      setLoading(true);
      // Tambahkan cache breaker agar data selalu paling baru
      const res = await fetch(`${SCRIPT_URL}?_t=${new Date().getTime()}`);
      const json = await res.json();
      
      // Google Sheets Apps Script kita sudah mengembalikan data dalam bentuk Array
      setData(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error("Gagal ambil data absensi:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [SCRIPT_URL]);

  // 2. Fungsi Export ke Excel
  const exportToExcel = () => {
    if (filteredData.length === 0) return alert("Data kosong, tidak ada yang bisa di-export!");

    // Rapikan data untuk Excel
    const excelData = filteredData.map((r, i) => ({
      "No": i + 1,
      "Nama Karyawan": r.nama,
      "Tanggal": r.tanggal,
      "Tipe Absen": r.tipe,
      "Status": r.status,
      "ID Karyawan": r.id
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap_Absensi");
    XLSX.writeFile(wb, `Rekap_Absensi_${new Date().toLocaleDateString('id-ID')}.xlsx`);
    alert("✅ Laporan Excel berhasil diunduh!");
  };

  // 3. Logika Filter (Nama & Tanggal)
  const filteredData = data.filter((item) => {
    // Cocokkan Nama atau ID
    const matchSearch = 
      item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchTerm.toLowerCase());

    // Cocokkan Tanggal (Jika filter tanggal diisi)
    // Catatan: Pastikan format tanggal dari Google Sheets sesuai (contoh: "08 Mar 2026")
    let matchDate = true;
    if (filterDate) {
      const d = new Date(filterDate);
      const bulanIndo = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
      const tglFormatted = ("0" + d.getDate()).slice(-2) + " " + bulanIndo[d.getMonth()] + " " + d.getFullYear();
      matchDate = item.tanggal === tglFormatted;
    }

    return matchSearch && matchDate;
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500">
      
      {/* HEADER & FILTER */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-black text-gray-800 uppercase tracking-tighter italic leading-none">Rekap Absensi</h3>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Laporan Kehadiran Pegawai</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchData} 
              className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-2xl transition-all"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={exportToExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all active:scale-95"
            >
              <Download size={16}/> Export Excel
            </button>
          </div>
        </div>

        {/* INPUT FILTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari Nama atau ID..." 
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input 
              type="date" 
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pegawai</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Waktu & Tanggal</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tipe</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-600 mb-2" size={32} />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sinkronisasi Data...</p>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-gray-400 font-bold italic">
                    Tidak ada rekaman absensi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-black text-gray-800 tracking-tight uppercase italic">{r.nama}</p>
                      <p className="text-[10px] font-bold text-blue-600">{r.id}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-700">{r.tanggal}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border ${
                        r.tipe === "MASUK" 
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {r.tipe}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-tighter italic">
                        {r.status || "Tepat Waktu"}
                      </span>
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

export default AttendanceRecord;