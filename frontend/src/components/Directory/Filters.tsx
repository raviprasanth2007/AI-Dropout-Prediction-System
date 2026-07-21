import { Search, Filter, SortAsc, LayoutGrid, List } from 'lucide-react';
import { type SortConfig } from '../../hooks/useStudentsDirectory';

interface Props {
  filters: any;
  sorting: { sortConfig: SortConfig; setSortConfig: (config: SortConfig) => void };
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  departments: string[];
}

export const DirectoryFilters = ({ filters, sorting, viewMode, setViewMode, departments }: Props) => {
  const {
    searchTerm, setSearchTerm,
    selectedDepartment, setSelectedDepartment,
    selectedSemester, setSelectedSemester,
    selectedRisk, setSelectedRisk
  } = filters;

  const { sortConfig, setSortConfig } = sorting;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, direction] = e.target.value.split('-');
    setSortConfig({ key, direction: direction as 'asc' | 'desc' });
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Student Name or Register Number..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner placeholder-gray-500"
          />
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <select
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={handleSortChange}
              className="appearance-none bg-white/5 border border-white/10 text-white pl-10 pr-10 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="cgpa-desc">Highest CGPA</option>
              <option value="cgpa-asc">Lowest CGPA</option>
              <option value="attendancePercentage-desc">Highest Attendance</option>
              <option value="attendancePercentage-asc">Lowest Attendance</option>
              <option value="risk-desc">Highest Risk</option>
            </select>
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2 text-sm">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 font-medium mr-2">Department:</span>
          {['ALL', ...departments].map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedDepartment === dept 
                  ? 'bg-primary text-white shadow-[0_0_10px_rgba(var(--primary),0.3)]' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>


    </div>
  );
};
