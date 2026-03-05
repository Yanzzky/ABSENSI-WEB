import React from 'react';
import { CalendarDays, MapPin, Clock } from 'lucide-react';

const JadwalMingguan = () => {
  // Array jadwal statis (Nanti bisa diganti ambil dari Google Sheets)
  const jadwal = [
    { id: 1, hari: "Senin", jam: "08:00 - 17:00", lokasi: "Kantor Pusat - Sudirman", libur: false },
    { id: 2, hari: "Selasa", jam: "08:00 - 17:00", lokasi: "Kantor Pusat - Sudirman", libur: false },
    { id: 3, hari: "Rabu", jam: "08:00 - 17:00", lokasi: "Kantor Cabang - Kemang", libur: false },
    { id: 4, hari: "Kamis", jam: "09:00 - 18:00", lokasi: "Event - JCC Senayan", libur: false },
    { id: 5, hari: "Jumat", jam: "08:00 - 17:00", lokasi: "Kantor Pusat - Sudirman", libur: false },
    { id: 6, hari: "Sabtu", jam: "-", lokasi: "-", libur: true },
    { id: 7, hari: "Minggu", jam: "-", lokasi: "-", libur: true },
  ];

  const hariIni = new Date().getDay();
  const indexHariIni = hariIni === 0 ? 6 : hariIni - 1;

  return (
    <div className="p-6 pb-24">
      <div className="fixeq items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <CalendarDays className="text-blue-600 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Jadwal Mingguan</h2>
          <p className="text-sm text-gray-500">Daftar lokasi presensi Anda minggu ini</p>
        </div>
      </div>

      <div className="space-y-4">
        {jadwal.map((item, index) => {
          const isHariIni = index === indexHariIni;

          return (
            <div key={item.id} className={`p-4 rounded-2xl border-2 transition-all ${
              isHariIni ? 'border-blue-500 bg-blue-50/50 shadow-md transform scale-[1.02]' 
                        : item.libur ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-gray-100 bg-white'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <span className={`font-bold ${isHariIni ? 'text-blue-700' : 'text-gray-700'}`}>
                  {item.hari} {isHariIni && "(Hari Ini)"}
                </span>
                {item.libur && <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded-md">LIBUR</span>}
              </div>

              {!item.libur && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>{item.jam}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className={`w-4 h-4 ${isHariIni ? 'text-red-500' : 'text-blue-400'}`} />
                    <span className={isHariIni ? 'font-medium text-gray-800' : ''}>{item.lokasi}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JadwalMingguan;