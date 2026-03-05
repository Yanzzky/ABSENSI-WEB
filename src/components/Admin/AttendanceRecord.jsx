import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

const AttendanceRecord = ({ SCRIPT_URL }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(SCRIPT_URL);
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, [SCRIPT_URL]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex justify-between items-center">
        <h3 className="font-black text-gray-800 italic">REKAP ABSENSI TERBARU</h3>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><Download size={16}/> EXCEL</button>
      </div>
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="p-6">Nama</th>
                <th className="p-6">Waktu</th>
                <th className="p-6">Tipe</th>
                <th className="p-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((r, i) => (
                <tr key={i} className="text-sm font-medium text-gray-700">
                  <td className="p-6 font-bold">{r.nama}</td>
                  <td className="p-6">{r.tanggal} <span className="text-gray-400 ml-2">{r.jam}</span></td>
                  <td className={`p-6 font-black ${r.tipe === "MASUK" ? 'text-blue-600' : 'text-orange-600'}`}>{r.tipe}</td>
                  <td className="p-6 text-xs bg-gray-50">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecord;