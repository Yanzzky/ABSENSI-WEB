import React from 'react';
import { MapPin, Clock, Save } from 'lucide-react';

const SystemSettings = () => (
  <div className="max-w-xl space-y-6">
    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Radius Absen (Meter)</label>
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent focus-within:border-blue-500">
          <MapPin className="text-blue-600" size={20}/>
          <input type="number" defaultValue="50" className="bg-transparent w-full outline-none font-bold text-gray-800" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Jam Masuk</label>
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent">
          <Clock className="text-blue-600" size={20}/>
          <input type="time" defaultValue="08:00" className="bg-transparent w-full outline-none font-bold text-gray-800" />
        </div>
      </div>
      <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-blue-100 flex items-center justify-center gap-3">
        <Save size={20}/> SIMPAN PENGATURAN
      </button>
    </div>
  </div>
);

export default SystemSettings;