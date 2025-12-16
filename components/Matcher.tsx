import React, { useState } from 'react';
import { Users, Search, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { Investor, PitchAnalysis } from '../types';
import { matchInvestors } from '../services/geminiService';
import { MOCK_INVESTORS } from '../constants';

interface MatcherProps {
  analysis: PitchAnalysis | null;
  onInvestorsMatched: (investors: Investor[]) => void;
  matchedInvestors: Investor[];
}

const Matcher: React.FC<MatcherProps> = ({ analysis, onInvestorsMatched, matchedInvestors }) => {
  const [isMatching, setIsMatching] = useState(false);

  const handleMatch = async () => {
    if (!analysis) return;
    setIsMatching(true);
    try {
      // In a real app, this would hit a Python backend with Pinecone.
      // Here we simulate the semantic matching using Gemini's reasoning capabilities.
      const rankedInvestors = await matchInvestors(analysis, MOCK_INVESTORS);
      onInvestorsMatched(rankedInvestors);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMatching(false);
    }
  };

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-white rounded-xl border border-dashed border-slate-300">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <Search className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No Analysis Found</h3>
        <p className="text-slate-500 max-w-sm mt-2">
          Please analyze a pitch deck in Phase A before searching for investors.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
             <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Phase B: The "Rolodex" (Matching)
            </h2>
            <p className="text-slate-500 mt-2">
              Based on the "Ideal Investor Profile" extracted from your deck, we will search our vector database for the highest compatibility.
            </p>
          </div>
          <button
            onClick={handleMatch}
            disabled={isMatching}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isMatching ? (
               <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Matching Thesis...
               </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Find Investors
              </>
            )}
          </button>
        </div>

        {/* Input Summary Context */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase">Target Profile</span>
          <p className="text-sm text-slate-700 mt-1">{analysis.idealInvestorProfile}</p>
        </div>
      </div>

      {matchedInvestors.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {matchedInvestors.map((investor) => (
            <div 
              key={investor.id} 
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900 text-lg">{investor.name}</h3>
                  <span className="text-sm text-slate-500 font-medium">@ {investor.firm}</span>
                  {investor.matchScore && investor.matchScore > 85 && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">
                      {investor.matchScore}% Match
                    </span>
                  )}
                  {investor.matchScore && investor.matchScore <= 85 && investor.matchScore > 60 && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold">
                      {investor.matchScore}% Match
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">Focus: {investor.focus} • AUM: {investor.aum}</p>
                {investor.matchReason && (
                   <p className="text-sm text-indigo-700 mt-2 bg-indigo-50 p-2 rounded flex items-start">
                     <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                     {investor.matchReason}
                   </p>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                <div className="text-xs text-slate-400">Past Deals</div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {investor.pastDeals.map(deal => (
                    <span key={deal} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                      {deal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matcher;
