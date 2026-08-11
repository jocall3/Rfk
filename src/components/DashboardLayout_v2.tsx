import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Search, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Settings, 
  LayoutDashboard, 
  Compass,
  Bell,
  User
} from 'lucide-react';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
      }`}
    >
      <span className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-100'}`}>
        {icon}
      </span>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeTab = 'Overview', 
  onTabChange 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { id: 'Overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'Answered', label: 'Answered Questions', icon: <FileText size={20} /> },
    { id: 'Research', label: 'Research & Gather', icon: <Compass size={20} /> },
    { id: 'NewQuestions', label: 'Next 20 Questions', icon: <HelpCircle size={20} /> },
    { id: 'Documentation', label: 'Markdown Files', icon: <BookOpen size={20} /> },
    { id: 'Settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-zinc-900 border-r border-zinc-800/80 
        transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              ResearchHub
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => (
            <SidebarLink
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => handleTabClick(item.id)}
            />
          ))}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-800/30 transition-colors duration-200">
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">Researcher AI</p>
              <p className="text-xs text-zinc-500 truncate">researcher@project.local</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-30">
          <div className="flex items-center space-x-4 flex-1 max-w-md">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            >
              <Menu size={20} />
            </button>
            
            {/* Search Bar */}
            <div className="relative w-full hidden sm:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search questions, research, markdown..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800/40 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>
            <div className="h-8 w-px bg-zinc-800 hidden sm:block" />
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full border border-zinc-700/50 font-medium">
                Project Progress: 40 Files
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Container */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Mobile Search Bar (Visible only on mobile) */}
            <div className="relative w-full sm:hidden mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>

            {/* Dynamic Content Injection */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};