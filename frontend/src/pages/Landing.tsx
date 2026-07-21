import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Navigation */}
      <nav className="w-full p-6 flex justify-between items-center relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            <BrainCircuit className="text-primary w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Nexus AI
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            Sign In
          </Link>
          <Link to="/login" className="px-5 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Next-Gen Early Warning System</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Prevent Dropouts with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary/80 animate-gradient">
              Predictive Intelligence
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Harness the power of machine learning to identify at-risk students before they fall behind. Actionable insights, real-time tracking, and comprehensive analytics for educational institutions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/login" className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <span>Enter Platform</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full border border-white/10 transition-all hover:scale-105 active:scale-95">
              Explore Features
            </a>
          </div>
        </motion.div>
      </main>

      {/* Features Showcase */}
      <section id="features" className="py-20 relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Analytics</h3>
              <p className="text-gray-400 leading-relaxed">Monitor student performance metrics and behavioral patterns instantly across all departments.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Predictions</h3>
              <p className="text-gray-400 leading-relaxed">Deep learning models analyze historical data to accurately predict the likelihood of student dropout.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure & Scalable</h3>
              <p className="text-gray-400 leading-relaxed">Enterprise-grade security with role-based access control ensuring sensitive student data remains protected.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
