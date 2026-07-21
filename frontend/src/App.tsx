import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import DatasetUpload from './pages/DatasetUpload';
import Landing from './pages/Landing';
import Sidebar from './components/Sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-primary/10 blur-[100px] -z-10 rounded-full mix-blend-screen pointer-events-none" />
        {children}
      </main>
    </div>
  );
};

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const PrivateRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
    if (!token) return <Navigate to="/login" />;
    if (roles && user && !roles.includes(user.role)) return <Navigate to="/" />;
    return <Layout>{children}</Layout>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        
        <Route path="/predict" element={
          <PrivateRoute roles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY_ADVISOR']}>
            <Prediction />
          </PrivateRoute>
        } />
        
        <Route path="/upload" element={
          <PrivateRoute roles={['SUPER_ADMIN', 'COLLEGE_ADMIN']}>
            <DatasetUpload />
          </PrivateRoute>
        } />
        
      </Routes>
    </Router>
  );
}

export default App;
