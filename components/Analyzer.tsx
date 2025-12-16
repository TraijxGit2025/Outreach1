import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PitchAnalysis } from '../types';
import { analyzePitchDeck } from '../services/geminiService';
import { INITIAL_PITCH_TEXT } from '../constants';

interface AnalyzerProps {
  onAnalysisComplete: (analysis: PitchAnalysis) => void;
  currentAnalysis: PitchAnalysis | null;
}

const Analyzer: React.FC<AnalyzerProps> = ({ onAnalysisComplete, currentAnalysis }) => {
  const [text, setText] = useState(INITIAL_PITCH_TEXT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzePitchDeck(text);
      onAnalysisComplete(result);
    } catch (err) {
      setError("Analysis failed. Please check your API Key and try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Phase A: Document Analysis
        </h2>
        <p className="text-slate-500 mb-6">
          Upload your pitch deck text below. The RoboBanker "Brain" will extract key value propositions, industry tags, and funding requirements.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Pitch Deck Content (Text)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-48 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            placeholder="Paste your pitch deck text here..."
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            <span className="font-semibold">Note:</span> In a production environment, this would accept PDF uploads via PyMuPDF.
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || text.length < 10}
            className={`flex items-center px-6 py-2 rounded-lg text-white font-medium transition-colors ${
              isAnalyzing || text.length < 10 ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Analyze Pitch
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
      </div>

      {currentAnalysis && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center text-emerald-800">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Analysis Complete</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Company Name</h3>
              <p className="text-lg font-bold text-slate-900">{currentAnalysis.companyName}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Industry</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {currentAnalysis.industry}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Funding Stage</h3>
              <p className="text-slate-800">{currentAnalysis.stage}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ask Amount</h3>
              <p className="text-slate-800 font-mono">{currentAnalysis.askAmount}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Value Proposition</h3>
              <p className="text-slate-700 italic border-l-4 border-indigo-200 pl-4 py-2 bg-slate-50 rounded-r-lg">
                "{currentAnalysis.valueProposition}"
              </p>
            </div>
             <div className="md:col-span-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ideal Investor Profile</h3>
              <p className="text-slate-700">{currentAnalysis.idealInvestorProfile}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
