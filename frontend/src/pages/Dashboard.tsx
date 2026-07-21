import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, Building, BrainCircuit, Activity, IndianRupee } from 'lucide-react';

const COLORS = ['#f43f5e', '#fbbf24', '#10b981']; // High (Rose), Med (Amber), Low (Emerald)

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Activity className="w-10 h-10 text-primary animate-pulse" />
        <p className="text-gray-400 font-medium">Syncing live analytics...</p>
      </div>
    );
  }

  const pieData = stats ? [
    { name: 'High Risk', value: stats.riskDistribution.high },
    { name: 'Medium Risk', value: stats.riskDistribution.medium },
    { name: 'Low Risk', value: stats.riskDistribution.low },
  ] : [];

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 z-10 relative pb-10">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">System Overview</h1>
          <p className="text-gray-400 mt-2 font-medium">Real-time dropout prediction and financial analytics</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-sm px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>Live Data Sync Active</span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -5, scale: 1.02 }} className="glass-card flex flex-col justify-center space-y-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400"><Users className="w-6 h-6" /></div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-white tracking-tight">{stats?.totalStudents || 0}</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Total Students</p>
          </div>
        </motion.div>
        
        <motion.div whileHover={{ y: -5, scale: 1.02 }} className="glass-card flex flex-col justify-center space-y-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400"><Building className="w-6 h-6" /></div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-white tracking-tight">{stats?.totalDepartments || 0}</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Active Departments</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5, scale: 1.02 }} className="glass-card flex flex-col justify-center space-y-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400"><IndianRupee className="w-6 h-6" /></div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white tracking-tight">{formatCurrency(stats?.financialStats?.totalPending || 0)}</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Total Fee Pending</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5, scale: 1.02 }} className="glass-card flex flex-col justify-center space-y-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
          <div className="flex items-center justify-between">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary"><BrainCircuit className="w-6 h-6" /></div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-white tracking-tight">{stats?.totalPredictions || 0}</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">AI Predictions Executed</p>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass-card flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">Global Risk Distribution</h3>
          <p className="text-sm text-gray-400 mb-6">AI-determined dropout probabilities across the campus.</p>
          <div className="h-80 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={90}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-lg outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-8 mt-4 bg-white/5 py-4 rounded-xl border border-white/5">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex flex-col items-center space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm font-medium text-gray-300">{entry.name}</span>
                </div>
                <span className="text-xl font-bold text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">Average Risk by Department</h3>
          <p className="text-sm text-gray-400 mb-6">Comparative view of department vulnerabilities.</p>
          <div className="h-80 flex-1 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.departmentRisk || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="department" stroke="#a1a1aa" tickLine={false} axisLine={false} tick={{ fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis stroke="#a1a1aa" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="avgRisk" name="Avg Risk %" fill="url(#colorUv)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
