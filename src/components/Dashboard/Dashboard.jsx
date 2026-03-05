import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CalendarCheck, AlertTriangle, UserX, Loader2, Coffee, UserMinus } from 'lucide-react';

const Dashboard = ({ user, onScanClick }) => {
  const [rekap, setRekap] = useState({ hadir: 0, terlambat: 0, izin: 0, alpa: 0 });
  const [statusHariIni, setStatusHariIni] = useState("BELUM ABSEN");
  const [isLibur, setIsLibur] = useState(false);
  const [loading, setLoading] = useState(true);

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzdwXS_5t39g_4tAbv5_fTW_Xff0IoAKGdpkq3PlyhXYSDLWEfx2CvE13cricWY7Mo/exec";

  // Fungsi menghitung hari kerja (Senin-Jumat) yang sudah lewat di bulan ini
  const hitungHariKerjaLewat = () => {
    const hariIni = new Date();
    const bulanSekarang = hariIni.getMonth();
    const tahunSekarang = hariIni.getFullYear();
    let jumlahHariKerja = 0;

    for (let d = 1; d <= hariIni.getDate(); d++) {
      const tanggalCek = new Date(tahunSekarang, bulanSekarang, d);
      const hari = tanggalCek.getDay();
      if (hari !== 0 && hari !== 6) { // Bukan Sabtu (6) & Minggu (0)
        jumlahHariKerja++;
      }
    }
    return jumlahHariKerja;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const hariKe = new Date().getDay();
        const checkLibur = hariKe === 0 || hariKe === 6;
        setIsLibur(checkLibur);

        const response = await fetch(`${SCRIPT_URL}?id=${user.id}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          const tglHariIni = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
          
          let countHadir = 0;
          let countTerlambat = 0;
          let countIzin = 0;
          let sudahAbsen = false;

          // Ambil daftar tanggal unik saat user hadir/izin untuk menghindari double count
          const tanggalUnikHadir = new Set();

          data.forEach(item => {
            if (item.tipe === "MASUK") {
              countHadir++;
              tanggalUnikHadir.add(item.tanggal);
              if (item.status.toLowerCase().includes("terlambat")) {
                countTerlambat++;
              }
            }
            
            if (item.status.toLowerCase().includes("izin") || item.status.toLowerCase().includes("sakit")) {
              countIzin++;
              tanggalUnikHadir.add(item.tanggal);
            }

            if (item.tanggal === tglHariIni) sudahAbsen = true;
          });

          // HITUNG ALPA: Hari Kerja Lewat - (Hadir + Izin)
          const hariKerjaHarusnya = hitungHariKerjaLewat();
          const totalMasukDanIzin = tanggalUnikHadir.size;
          const hitungAlpa = Math.max(0, hariKerjaHarusnya - totalMasukDanIzin);

          setRekap({ 
            hadir: countHadir, 
            terlambat: countTerlambat, 
            izin: countIzin, 
            alpa: hitungAlpa 
          });
          
          if (sudahAbsen) {
            setStatusHariIni(checkLibur ? "SUDAH ABSEN LEMBUR" : "SUDAH ABSEN");
          } else {
            setStatusHariIni(checkLibur ? "LIBUR AKHIR PEKAN" : "BELUM ABSEN");
          }
        }
      } catch (error) {
        console.error("Gagal memuat dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="p-6">
      {/* CARD PRESENSI HARI INI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">Presensi Hari Ini</h2>
          <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            statusHariIni.includes("SUDAH") ? 'bg-green-50 text-green-600' : isLibur ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
          }`}>
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : isLibur && !statusHariIni.includes("SUDAH") ? <Coffee className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-sm text-gray-500">Status Anda</p>
            <p className={`text-lg font-bold ${statusHariIni.includes("SUDAH") ? 'text-green-600' : isLibur ? 'text-orange-600' : 'text-gray-800'}`}>
              {loading ? "MENGECEK..." : statusHariIni}
            </p>
          </div>
        </div>

        <button 
          onClick={onScanClick} 
          disabled={statusHariIni.includes("SUDAH") || loading}
          className={`w-full font-bold py-3 rounded-xl transition-all ${
            statusHariIni.includes("SUDAH") ? 'bg-gray-100 text-gray-400' : isLibur ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white shadow-lg'
          }`}
        >
          {statusHariIni.includes("SUDAH") ? "Presensi Selesai" : isLibur ? "Scan Presensi Lembur" : "Scan Presensi Sekarang"}
        </button>
      </div>

      {/* REKAP KESELURUHAN (GRID 2x2) */}
      <h3 className="font-bold text-gray-800 mb-3 ml-1">Rekap Bulan Ini</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Hadir */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase">Hadir</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{loading ? ".." : rekap.hadir} <span className="text-xs font-normal text-gray-400">Hari</span></p>
        </div>

        {/* Telat */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase">Telat</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{loading ? ".." : rekap.terlambat} <span className="text-xs font-normal text-gray-400">Kali</span></p>
        </div>

        {/* Izin */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserX className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase">Izin</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{loading ? ".." : rekap.izin} <span className="text-xs font-normal text-gray-400">Hari</span></p>
        </div>

        {/* Alpa */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <UserMinus className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase">Alpa</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{loading ? ".." : rekap.alpa} <span className="text-xs font-normal text-gray-400">Hari</span></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;