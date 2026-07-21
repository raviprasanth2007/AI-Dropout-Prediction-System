import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UploadCloud, LogOut, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 glass-panel border-r border-white/10 flex flex-col h-full relative z-20"
    >
      <div className="p-6 flex items-center space-x-3">
        <div className="p-2 bg-primary/20 rounded-xl">
          <BrainCircuit className="text-primary w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Nexus AI
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavLink to="/dashboard" className={({isActive}) => `flex items-center space-x-3 p-3 rounded-xl transition-all ${isActive ? 'bg-primary/20 text-white border border-primary/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        
        {['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY_ADVISOR'].includes(role) && (
          <NavLink to="/predict" className={({isActive}) => `flex items-center space-x-3 p-3 rounded-xl transition-all ${isActive ? 'bg-primary/20 text-white border border-primary/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Users className="w-5 h-5" />
            <span>Student Prediction</span>
          </NavLink>
        )}
        
        {['SUPER_ADMIN', 'COLLEGE_ADMIN'].includes(role) && (
          <NavLink to="/upload" className={({isActive}) => `flex items-center space-x-3 p-3 rounded-xl transition-all ${isActive ? 'bg-primary/20 text-white border border-primary/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <UploadCloud className="w-5 h-5" />
            <span>Model & Data</span>
          </NavLink>
        )}
        

      </nav>

      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="mb-4 px-2">
          <p className="text-sm text-white font-medium">{user.name}</p>
          <p className="text-xs text-gray-400">{user.role}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
