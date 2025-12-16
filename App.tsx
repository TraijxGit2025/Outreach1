import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analyzer from './components/Analyzer';
import Matcher from './components/Matcher';
import Outreach from './components/Outreach';
import { AppView, Investor, PitchAnalysis } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // App State - In a real app, this would be Redux/Context/Zustand
  const [analysis, setAnalysis] = useState<PitchAnalysis | null>(null);
  const [investors, setInvestors] = useState<Investor[]>([]);

  const handleAnalysisComplete = (data: PitchAnalysis) => {
    setAnalysis(data);
    // Auto switch to matching view to guide the user
    setCurrentView(AppView.MATCHING);
  };

  const handleInvestorsMatched = (data: Investor[]) => {
    setInvestors(data);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard investors={investors} />;
      case AppView.ANALYZER:
        return (
          <Analyzer 
            onAnalysisComplete={handleAnalysisComplete} 
            currentAnalysis={analysis} 
          />
        );
      case AppView.MATCHING:
        return (
          <Matcher 
            analysis={analysis} 
            onInvestorsMatched={handleInvestorsMatched}
            matchedInvestors={investors}
          />
        );
      case AppView.OUTREACH:
        return <Outreach investors={investors} analysis={analysis} />;
      default:
        return <Dashboard investors={investors} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800">
            {currentView === AppView.DASHBOARD && 'Executive Overview'}
            {currentView === AppView.ANALYZER && 'Document Analysis'}
            {currentView === AppView.MATCHING && 'Investor Matching'}
            {currentView === AppView.OUTREACH && 'Outreach Manager'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
               <span className="text-sm font-medium text-slate-700">Demo User</span>
               <span className="text-xs text-slate-500">NexusAI Corp</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
              DU
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
