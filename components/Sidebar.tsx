import React from 'react';
import { LayoutDashboard, FileText, Users, Mail, Settings, ShieldAlert } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.ANALYZER, label: 'Deck Analysis', icon: FileText },
    { id: AppView.MATCHING, label: 'Investor Match', icon: Users },
    { id: AppView.OUTREACH, label: 'Campaigns', icon: Mail },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          RoboBanker
        </h1>
        <p className="text-xs text-slate-400 mt-1">AI Placement Agent</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              currentView === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-start">
             <ShieldAlert className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
             <div>
               <p className="text-[10px] font-bold text-slate-300 uppercase mb-1">Regulatory Warning</p>
               <p className="text-[10px] text-slate-500 leading-tight">
                 For demo purposes only. Automated solicitation may require broker-dealer registration in your jurisdiction.
               </p>
             </div>
          </div>
        </div>
        <div className="mt-4 flex items-center text-slate-500 text-sm cursor-pointer hover:text-white">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
