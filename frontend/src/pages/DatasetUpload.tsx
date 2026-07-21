import { useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UploadCloud, Database, Settings2, Loader2, CheckCircle2 } from 'lucide-react';

const DatasetUpload = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/model/generate-train', { numRecords: 1000 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err: any) {
      alert("Failed to generate and train. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('dataset', file);
      
      const res = await axios.post('http://localhost:5000/api/model/upload-dataset', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to upload and train.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 z-10 relative">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Model & Dataset Management</h1>
        <p className="text-gray-400 mt-1">Configure the AI engine by generating synthetic data or uploading a real institutional dataset.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mode 1: Synthetic Data */}
        <div className="glass-card flex flex-col items-center text-center p-8">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-6">
            <Database className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Mode 1: Synthetic Generation</h2>
          <p className="text-gray-400 text-sm mb-8">
            Automatically generate 1000+ realistic synthetic student records with logical correlations and train the model immediately. Perfect for initial setup.
          </p>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate & Train Model'}
          </button>
        </div>

        {/* Mode 2: Custom Upload */}
        <div className="glass-card flex flex-col items-center text-center p-8 border-primary/30">
          <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Mode 2: Real Dataset Upload</h2>
          <p className="text-gray-400 text-sm mb-6">
            Upload your institution's real CSV dataset. The system will handle missing values, map columns intelligently, and replace the existing ML model.
          </p>
          
          <input 
            type="file" 
            accept=".csv"
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          
          {file && (
            <div className="mb-4 text-sm text-primary flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{file.name} ready</span>
            </div>
          )}

          <div className="mt-auto w-full flex space-x-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition-all"
            >
              Select CSV
            </button>
            <button 
              onClick={handleUpload}
              disabled={loading || !file}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-medium transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upload & Train'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card mt-8">
          <h3 className="text-lg font-bold text-green-400 flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <span>Success: {result.message}</span>
          </h3>
          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Records Processed</p>
                <p className="text-xl font-bold text-white">{result.records_generated || result.records_processed}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Best Model Selected</p>
                <p className="text-xl font-bold text-primary">{result.training_results?.best_model}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Accuracy</p>
                <p className="text-xl font-bold text-white">
                  {(result.training_results?.accuracy * 100).toFixed(2)}%
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5">
              <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center space-x-2">
                <Settings2 className="w-4 h-4" />
                <span>Model Comparisons</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(result.training_results?.all_results || {}).map(([name, acc]: any) => (
                  <div key={name} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                    <span className="text-sm text-gray-300">{name}</span>
                    <span className="text-sm font-semibold text-white">{(acc * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DatasetUpload;
