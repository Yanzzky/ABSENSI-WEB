import React from 'react';
import { UserCog, ShieldCheck, Mail, IdCard, Key } from 'lucide-react';

const AdminProfile = ({ user }) => (
  <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
    <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-50 pb-10">
        <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white">
          {user?.nama?.substring(0, 2).toUpperCase() || "AD"}
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter italic uppercase">{user?.nama || "Admin Name"}</h2>
          <p className="text-blue-600 font-bold text-sm tracking-widest uppercase mt-1">Super Administrator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl text-gray-700 font-bold text-sm border border-transparent hover:border-blue-100 transition-all">
            <Mail size={18} className="text-blue-500"/> {user?.identitas || "admin@presensiku.com"}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Admin ID</label>
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl text-gray-700 font-bold text-sm border border-transparent">
            <IdCard size={18} className="text-blue-500"/> {user?.id || "ADM-001"}
          </div>
        </div>
      </div>

      <button className="mt-10 w-full md:w-auto bg-gray-800 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg hover:bg-black transition-all">
        <Key size={18}/> Ubah Password Keamanan
      </button>
    </div>
  </div>
);

export default AdminProfile;