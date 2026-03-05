import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, UserPlus, MoreVertical, CheckCircle2, 
  Clock, Smartphone, Download, Loader2, RefreshCw,
  SortAsc, SortDesc, ChevronDown
} from 'lucide-react';

const UserManagement = ({ SCRIPT_URL }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nama', direction: 'asc' });

  // 1. Fetch Data dengan cache-buster
  const fetchUsers = useCallback(async (isAuto = false) => {
    try {
      if (!isAuto) setLoading(true);
      else setIsRefreshing(true);

      const response = await fetch(`${SCRIPT_URL}?action=getUsers&_t=${new Date().getTime()}`);
      const data = await response.json();
      
      // Jika error "ID User Kosong" muncul lagi, berarti Apps Script belum diupdate
      if (data.error) {
        console.error("Error dari Server:", data.error);
        setUsers([]);
      } else {
        setUsers(Array.isArray(data) ? data : []);
      }
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

  // 2. Logika Sorting (Ascending / Descending)
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers.filter(user => 
      user.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.identitas?.toString().includes(searchTerm)
    );
  }, [users, sortConfig, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ACTION BAR */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau ID..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Menu Dropdown Sorting */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-3 rounded-2xl font-bold text-sm hover:bg-gray-100">
              {sortConfig.direction === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
              Sort: {sortConfig.key === 'nama' ? 'Nama' : 'ID'}
              <ChevronDown size={14} />
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 transition-all">
              <button onClick={() => requestSort('nama')} className="w-full text-left p-2 hover:bg-blue-50 rounded-lg text-xs font-bold">Urut Nama</button>
              <button onClick={() => requestSort('id')} className="w-full text-left p-2 hover:bg-blue-50 rounded-lg text-xs font-bold">Urut ID</button>
            </div>
          </div>

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
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600" onClick={() => requestSort('nama')}>
                  User & Info {sortConfig.key === 'nama' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr>
              ) : sortedUsers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black">
                      {item.nama?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 leading-none mb-1">{item.nama}</p>
                      <p className="text-[11px] text-gray-400 italic">ID: {item.id} • {item.email}</p>
                    </div>
                  </td>
                  <td className="p-6 text-xs font-bold text-gray-600">{item.role || 'Pegawai'}</td>
                  <td className="p-6"><div className="flex items-center gap-2 text-emerald-600 font-bold text-xs"><CheckCircle2 size={14} /> Active</div></td>
                  <td className="p-6 text-center"><button className="p-2 text-gray-300 hover:text-blue-600"><MoreVertical size={20}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;