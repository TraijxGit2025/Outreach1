import React, { useState } from 'react';
import { Mail, Send, Calendar, RefreshCw, Loader2, ArrowLeft } from 'lucide-react';
import { Investor, PitchAnalysis, OutreachDraft } from '../types';
import { generateColdEmail, generateEmailSubject } from '../services/geminiService';

interface OutreachProps {
  investors: Investor[];
  analysis: PitchAnalysis | null;
}

const Outreach: React.FC<OutreachProps> = ({ investors, analysis }) => {
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [draft, setDraft] = useState<OutreachDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectInvestor = async (investor: Investor) => {
    if (!analysis) return;
    setSelectedInvestor(investor);
    setIsGenerating(true);
    
    try {
      // Parallel generation for speed
      const [subject, body] = await Promise.all([
        generateEmailSubject(analysis, investor),
        generateColdEmail(analysis, investor)
      ]);
      
      setDraft({
        recipient: investor,
        subject,
        body
      });
    } catch (e) {
      console.error("Failed to generate draft", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    setSelectedInvestor(null);
    setDraft(null);
  }

  if (!analysis || investors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-white rounded-xl border border-dashed border-slate-300">
        <Mail className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">Review Required</h3>
        <p className="text-slate-500 max-w-sm mt-2">
          Please match investors in Phase B before starting outreach campaigns.
        </p>
      </div>
    );
  }

  // Email Editor View
  if (selectedInvestor) {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <button onClick={handleBack} className="text-sm text-slate-500 hover:text-slate-800 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
          </button>
          <div className="text-sm font-semibold text-slate-700">
             Drafting for: <span className="text-indigo-600">{selectedInvestor.name}</span>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-4">
           {isGenerating ? (
             <div className="h-64 flex flex-col items-center justify-center text-slate-400">
               <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
               <p>AI is analyzing {selectedInvestor.firm}'s portfolio...</p>
               <p className="text-xs mt-2">Writing hyper-personalized copy...</p>
             </div>
           ) : draft ? (
             <>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                 <input 
                    type="text" 
                    value={draft.subject}
                    onChange={(e) => setDraft({...draft, subject: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                 />
               </div>
               <div className="flex-1 flex flex-col">
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Body</label>
                 <textarea 
                    value={draft.body}
                    onChange={(e) => setDraft({...draft, body: e.target.value})}
                    className="flex-1 w-full p-4 border border-slate-300 rounded text-slate-700 leading-relaxed resize-none focus:outline-none focus:border-indigo-500 font-sans"
                 />
               </div>
             </>
           ) : null}
        </div>

        {!isGenerating && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
             <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-600 bg-white hover:bg-slate-50">
               <RefreshCw className="w-4 h-4 mr-2" />
               Regenerate
             </button>
             <button className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm">
               <Send className="w-4 h-4 mr-2" />
               Approve & Send (Mock)
             </button>
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-600" />
          Phase C: Outreach Automation
        </h2>
        <p className="text-slate-500 mt-2">
          Select an investor to generate a hyper-personalized email referencing their thesis and past deals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {investors.map(investor => (
          <div key={investor.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between h-48">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800">{investor.name}</h3>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{investor.status}</span>
              </div>
              <p className="text-sm text-indigo-600 font-medium mb-1">{investor.firm}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{investor.matchReason || "Match not yet calculated."}</p>
            </div>
            
            <button 
              onClick={() => handleSelectInvestor(investor)}
              className="w-full mt-4 py-2 bg-white border border-indigo-200 text-indigo-700 font-medium text-sm rounded-lg hover:bg-indigo-50 flex items-center justify-center transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Draft Email
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Outreach;
