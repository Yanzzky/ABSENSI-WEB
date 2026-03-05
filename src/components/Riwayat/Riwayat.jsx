import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Clock, Loader2, RefreshCw } from 'lucide-react';

const Riwayat = ({ userId }) => { // Ambil userId dari props (Data login)
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL Web App yang Anda dapatkan setelah Deploy
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzdwXS_5t39g_4tAbv5_fTW_Xff0IoAKGdpkq3PlyhXYSDLWEfx2CvE13cricWY7Mo/exec";

  const fetchHistory = async () => {
    if (!userId) {
      console.error("userId tidak ditemukan!");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${SCRIPT_URL}?id=${userId}`);
      
      // Cek apakah response oke (status 200)
      if (!response.ok) throw new Error("Gagal menyambung ke server");

      const data = await response.json();
      console.log("Data diterima:", data); // Cek apakah datanya sampai
      setHistoryData(data);
    } catch (error) {
      console.error("Error Detail:", error.message);
      alert("Gagal mengambil data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <FileText className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Riwayat</h2>
            <p className="text-xs text-gray-500">Presensi Anda terupdate</p>
          </div>
        </div>
        
        <button 
          onClick={fetchHistory}
          disabled={loading}
          className="p-2 hover:bg-white rounded-full transition-all active:scale-95"
        >
          <RefreshCw className={`w-5 h-5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <p className="animate-pulse">Mengambil data dari server...</p>
        </div>
      ) : historyData.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-300 w-8 h-8" />
          </div>
          <p className="text-gray-400">Belum ada data presensi.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyData.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-800">{item.tanggal}</span>
                <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${
                  item.tipe === 'MASUK' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {item.tipe}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3 text-gray-600">
                  <Clock className="w-4 h-4 mt-0.5 text-blue-500" /> 
                  <div>
                    <p className="font-medium text-gray-800">{item.jam}</p>
                    <p className={`text-xs ${item.status.includes('Terlambat') || item.status.includes('Cepat') ? 'text-red-500' : 'text-green-600'}`}>
                      {item.status}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600 pt-1 border-t border-gray-50">
                  <MapPin className="w-4 h-4 text-gray-400" /> 
                  <span className="text-xs truncate">{item.lokasi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Riwayat;