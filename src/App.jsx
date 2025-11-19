import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { parseChat } from './utils/parser';
import { analyzeChat } from './utils/analyzer';
import { AnimatePresence, motion } from 'framer-motion';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (text) => {
    setLoading(true);
    setError(null);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      console.log("File content length:", text.length);
      console.log("First 100 chars:", text.substring(0, 100));

      const messages = parseChat(text);
      console.log("Parsed messages:", messages.length);

      if (messages.length === 0) {
        throw new Error("No messages found. Please check the file format.");
      }

      const stats = analyzeChat(messages);
      if (!stats) {
        throw new Error("Analysis failed");
      }

      console.log("Analysis Results:", stats);
      setData(stats);
    } catch (err) {
      console.error("Error parsing chat:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-green-500/30">
        {!data ? (
          <div className="relative">
            <FileUpload onFileUpload={handleFileUpload} />
            {error && (
              <div className="absolute bottom-10 left-0 right-0 mx-auto w-full max-w-md p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-center">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
                <p className="text-xs mt-2 opacity-70">Check console for details</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Dashboard data={data} />
            <button
              onClick={() => setData(null)}
              className="fixed bottom-6 right-6 p-3 bg-slate-800 hover:bg-slate-700 rounded-full shadow-lg transition-colors z-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
            </button>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-green-400 font-medium animate-pulse">Analyzing your chat...</p>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
