import React from 'react';
import { Database, Download, Filter } from 'lucide-react';

const EmployeeData = () => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-center bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
      <h3 className="font-black text-gray-800 uppercase tracking-tighter italic">Data Induk Karyawan</h3>
      <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
        <Download size={16}/> Export Excel
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card Placeholder */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 text-center italic text-gray-300 font-bold">
        Total Pegawai: 150
      </div>
    </div>
  </div>
);

export default EmployeeData;