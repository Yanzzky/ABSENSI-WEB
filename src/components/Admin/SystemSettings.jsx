import React, { useState } from 'react';
import { MapPin, Clock, Save, Navigation, CalendarDays, Loader2, CheckCircle } from 'lucide-react';

const SystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Simulasi simpan ke Google Sheets (bisa pakai action: updateSettings nanti)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in duration-500 text-left">
      <div className="bg-white p-8 lg:p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
        
        <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
            <Navigation size={24} />
          </div>
          <div>
            <h3 className="font-black text-gray-800 uppercase tracking-tighter italic leading-none">Konfigurasi Geofencing</h3>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Atur Lokasi & Jarak Absensi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* RADIUS */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Radius Max (Meter)</label>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent focus-within:border-blue-500 transition-all">
              <MapPin className="text-blue-600" size={20}/>
              <input type="number" defaultValue="50" className="bg-transparent w-full outline-none font-black text-gray-800" />
            </div>
          </div>

          {/* KOORDINAT (WAJIB ADA) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Koordinat Kantor (Lat, Long)</label>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent focus-within:border-blue-500 transition-all">
              <Navigation className="text-blue-600" size={20}/>
              <input type="text" defaultValue="-6.2000, 106.8166" className="bg-transparent w-full outline-none font-black text-gray-800 text-sm" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-gray-50 pb-6 pt-4">
          <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg shadow-orange-100">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="font-black text-gray-800 uppercase tracking-tighter italic leading-none">Waktu Kerja</h3>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Jam Operasional & Toleransi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* JAM MASUK */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Jam Masuk (Start)</label>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent focus-within:border-blue-500 transition-all">
              <Clock className="text-blue-600" size={20}/>
              <input type="time" defaultValue="08:00" className="bg-transparent w-full outline-none font-black text-gray-800" />
            </div>
          </div>

          {/* JAM PULANG */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Jam Pulang (End)</label>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent focus-within:border-blue-500 transition-all">
              <CalendarDays className="text-orange-600" size={20}/>
              <input type="time" defaultValue="17:00" className="bg-transparent w-full outline-none font-black text-gray-800" />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className={`w-full p-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
            success ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20}/>
          ) : success ? (
            <><CheckCircle size={20}/> Pengaturan Tersimpan</>
          ) : (
            <><Save size={20}/> Simpan Perubahan Sistem</>
          )}
        </button>
      </div>

      <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 flex items-start gap-4">
        <div className="bg-orange-500 p-2 rounded-lg text-white"><MapPin size={16}/></div>
        <p className="text-[11px] text-orange-800 font-bold leading-relaxed italic">
          Peringatan: Perubahan radius dan koordinat akan langsung berdampak pada kemampuan pegawai dalam melakukan scan QR. Pastikan titik GPS kantor sudah akurat.
        </p>
      </div>
    </div>
  );
};

export default SystemSettings;