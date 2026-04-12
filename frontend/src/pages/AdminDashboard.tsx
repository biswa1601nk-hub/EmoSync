import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AlertTriangle, Send, Flag, MoreVertical, Filter } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UserData {
  id: string;
  name: string;
  stressLevel: number;
  criticalStatus: boolean;
  lastUpdated: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [manualFlags, setManualFlags] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 6;

  useEffect(() => {
    setCurrentPage(1); // Auto reset to first page upon any new search filters
  }, [searchQuery]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');
    
    socket.on('emotions-update', (data) => {
      setUsers(data);
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  const handleForward = (userId: string) => {
    alert(`Forwarding alert for User ID: ${userId} to authorities via API.`);
  };

  // Chart Data
  const chartData = {
    labels: users.map(u => u.name.split(' ')[0]), // Keep labels short
    datasets: [
      {
        label: 'Stress Level',
        data: users.map(u => u.stressLevel),
        backgroundColor: users.map(u => u.criticalStatus ? '#ef4444' : '#60a5fa'),
        borderRadius: 4,
        barPercentage: 0.6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: { 
      y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  const globalAvg = users.length > 0 
    ? Math.round(users.reduce((acc, u) => acc + u.stressLevel, 0) / users.length) 
    : 0;

  const toggleFlag = (id: string) => {
    setManualFlags(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const criticalUsers = users.filter(u => u.criticalStatus || manualFlags.has(u.id));

  const getActiveText = (dateStr: string) => {
    const diffMins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diffMins < 1) return 'Active Now';
    if (diffMins === 1) return 'Active 1m ago';
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `Active ${diffHours}h ago`;
  };

  const filteredTableUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filteredTableUsers.length / USERS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredTableUsers.slice((safeCurrentPage - 1) * USERS_PER_PAGE, safeCurrentPage * USERS_PER_PAGE);

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-transparent font-sans relative overflow-hidden">
      {/* Animated Motion Background Network */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-900/10 blur-[150px] animate-[pulse_12s_ease-in-out_infinite]"></div>
         <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-red-900/5 blur-[100px] animate-[pulse_15s_ease-in-out_infinite]"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Top Grid: Graph and Critical Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Section */}
          <div className="lg:col-span-2 bg-[#1a1d24]/40 backdrop-blur-3xl border border-gray-800/60 rounded-2xl p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Stress Pulse (Live)</h2>
                <p className="text-sm text-gray-400 mt-1">Aggregated tracking across {users.length} active users</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-400">{globalAvg}%</span>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Global Average</p>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              {users.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-600 font-medium">Awaiting live telemetry...</div>
              )}
            </div>
          </div>

          {/* Critical Latency Sidebar (Red Component) */}
          <div className="bg-[#991b1b] rounded-2xl p-6 shadow-red-900/20 shadow-2xl border border-red-800 flex flex-col relative overflow-hidden">
            {/* Subtle background glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <AlertTriangle className="w-6 h-6 text-white" fill="currentColor" /> Critical Latency
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4 z-10 w-full pr-2 custom-scrollbar">
              {criticalUsers.length > 0 ? (
                criticalUsers.map(user => (
                  <div key={user.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-white text-lg leading-tight w-2/3">{user.name}</h3>
                       <div className="bg-white rounded-full px-3 py-1 flex flex-col items-center justify-center shadow-sm">
                         <span className="text-red-600 font-bold text-sm leading-none">{user.stressLevel}%</span>
                         <span className="text-red-600 text-[9px] font-bold tracking-wider">STRESS</span>
                       </div>
                    </div>
                    <p className="text-red-100 text-xs mb-4 leading-relaxed">
                      Acute physiological variance detected. Stress signature exceeds safe threshold parameters.
                    </p>
                    <button 
                      onClick={() => handleForward(user.id)}
                      className="w-full bg-white text-red-700 hover:bg-gray-100 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Send className="w-4 h-4" /> Forward to Authorities
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-red-200/60 font-medium text-sm text-center px-4">
                  No active priority escalations. System operating within safe parameters.
                </div>
              )}
            </div>
            
            {criticalUsers.length > 0 && (
              <div className="pt-6 border-t border-white/20 mt-auto z-10">
                <p className="text-white/60 text-xs font-bold tracking-widest uppercase text-center">
                  {criticalUsers.length} TOTAL PRIORITY ESCALATIONS
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Active User Monitoring Table Row */}
        <div className="bg-[#1a1d24]/40 backdrop-blur-3xl border border-gray-800/60 rounded-2xl shadow-2xl mt-6 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Active User Monitoring</h2>
            <div className="flex gap-3 text-gray-400 items-center">
               {isSearchOpen || searchQuery ? (
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search nodes by name..."
                   className="bg-[#13151b] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-3 py-1.5 outline-none text-sm w-48 transition-all"
                   autoFocus
                   onBlur={() => { if (!searchQuery) setIsSearchOpen(false) }}
                 />
               ) : (
                 <button onClick={() => setIsSearchOpen(true)} title="Filter Nodes" className="hover:text-white transition-colors p-1 cursor-pointer">
                   <Filter className="w-5 h-5"/>
                 </button>
               )}
               <button className="hover:text-white transition-colors p-1"><MoreVertical className="w-5 h-5"/></button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#13151b] text-gray-500 text-xs font-bold tracking-wider uppercase">
                <tr>
                  <th className="px-6 py-4">Name & ID</th>
                  <th className="px-6 py-4 w-1/4">Current Stress</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4">Flag</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold font-mono text-sm border border-blue-500/30">
                           {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                         </div>
                         <div>
                           <p className="text-white font-medium">{user.name}</p>
                           <p className="text-xs text-gray-500">ID: #{user.id.substring(user.id.length - 5).toUpperCase()}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                           <div 
                             className={`h-full rounded-full transition-all duration-1000 ${user.criticalStatus ? 'bg-red-500' : user.stressLevel > 60 ? 'bg-orange-500' : 'bg-blue-500'}`} 
                             style={{ width: `${user.stressLevel}%` }}
                           ></div>
                         </div>
                      </div>
                      <span className={`text-xs mt-1 block font-medium ${user.criticalStatus ? 'text-red-400' : user.stressLevel > 60 ? 'text-orange-400' : 'text-blue-400'}`}>
                         {user.stressLevel}% - {user.criticalStatus ? 'Critical' : user.stressLevel > 60 ? 'High' : 'Low'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 w-max ${user.criticalStatus ? 'bg-red-500/10 text-red-400 border-red-500/20' : user.stressLevel > 60 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.criticalStatus ? 'bg-red-500' : user.stressLevel > 60 ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                        {user.criticalStatus ? 'Escalated' : user.stressLevel > 60 ? 'Monitoring' : 'Stable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                       {new Date(user.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleFlag(user.id)} className="p-1.5 -ml-1.5 rounded hover:bg-gray-800 transition-colors cursor-pointer group">
                        <Flag className={`w-4 h-4 transition-colors ${user.criticalStatus || manualFlags.has(user.id) ? 'text-red-500 fill-red-500/20' : 'text-gray-600 group-hover:text-gray-400'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-medium ${getActiveText(user.lastUpdated) === 'Active Now' ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {getActiveText(user.lastUpdated)}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {filteredTableUsers.length === 0 && (
                   <tr>
                     <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No active users match that query.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-800 bg-[#13151b] flex items-center justify-between text-xs text-gray-500 font-medium">
             <p>Showing {filteredTableUsers.length > 0 ? (safeCurrentPage - 1) * USERS_PER_PAGE + 1 : 0} to {Math.min(safeCurrentPage * USERS_PER_PAGE, filteredTableUsers.length)} of {filteredTableUsers.length} system nodes</p>
             <div className="flex border border-gray-800 rounded overflow-hidden">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className={`px-3 py-1 bg-gray-900 border-r border-gray-800 transition-colors ${safeCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 text-white'}`}
                >Prev</button>
                <div className="px-3 py-1 bg-blue-600 text-white font-bold">{safeCurrentPage} / {totalPages}</div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className={`px-3 py-1 bg-gray-900 border-l border-gray-800 transition-colors ${safeCurrentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 text-white'}`}
                >Next</button>
             </div>
          </div>

        </div>
        
        {/* Footer info matching screenshot design */}
        <div className="flex flex-col items-center pb-8 mt-12 gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
           <div className="flex gap-6 mb-2">
              <a href="#" className="hover:text-blue-400 hover:underline underline-offset-4">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 hover:underline underline-offset-4">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 hover:underline underline-offset-4">API Documentation</a>
           </div>
           <p>© 2026 EmoSync Platform. System Status: Operational.</p>
        </div>

      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.5); 
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
