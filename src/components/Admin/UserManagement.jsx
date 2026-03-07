import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, UserPlus, MoreVertical, CheckCircle2, 
  RefreshCw, SortAsc, SortDesc, ChevronDown, Loader2
} from 'lucide-react';

const UserManagement = ({ SCRIPT_URL }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nama', direction: 'asc' });

  const fetchUsers = useCallback(async (isAuto = false) => {
    try {
      if (!isAuto) setLoading(true);
      else setIsRefreshing(true);

      const response = await fetch(`${SCRIPT_URL}?action=getUsers&_t=${new Date().getTime()}`);
      const data = await response.json();
      
      setUsers(Array.isArray(data) ? data : []);
      console.log("Data mentah dari Sheet:", data);
    } catch (error) {
      console.error("Gagal load user:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [SCRIPT_URL]);

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => fetchUsers(true), 15000); 
    return () => clearInterval(interval);
  }, [fetchUsers]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(u => 
        Object.values(u).some(val => String(val).toLowerCase().includes(s))
      );
    }

    result.sort((a, b) => {
      const aVal = String(a[sortConfig.key] || "").toLowerCase();
      const bVal = String(b[sortConfig.key] || "").toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, sortConfig, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ACTION BAR */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari user..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm outline-none font-bold"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button onClick={() => requestSort('nama')} className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">
            {sortConfig.direction === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
            Urut: Nama
          </button>

          <button onClick={() => fetchUsers()} className="p-3 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => requestSort('nama')}>
                  Karyawan {sortConfig.key === 'nama' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identitas</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500" size={32} />
                    <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat Data...</p>
                  </td>
                </tr>
              ) : filteredAndSortedUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-20 text-center text-gray-400 font-bold italic">
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                filteredAndSortedUsers.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                          {(item.nama || "U").substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-gray-800 leading-none mb-1 uppercase tracking-tighter italic italic">
                            {item.nama || "No Name"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">ID: {item.id || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-bold text-gray-600">{item.identitas || "-"}</p>
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-[9px] font-black uppercase mt-1">
                        {item.role || "PEGAWAI"}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button className="p-2 text-gray-300 hover:text-blue-600 transition-colors">
                        <MoreVertical size={20} />
                      </button>
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

export default UserManagement;