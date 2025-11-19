import React, { useState } from 'react';
import Welcome from './components/Welcome';
import Game from './components/Game';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'game'>('welcome');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-[Vazirmatn] overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('welcome')}>
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold ml-3">P</div>
              <span className="font-bold text-xl tracking-tight text-slate-800">PharmaMaster</span>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="hidden sm:inline">گفتگو با استاد (AI)</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'welcome' && (
          <Welcome onStart={() => setView('game')} />
        )}
        {view === 'game' && (
          <Game onExit={() => setView('welcome')} />
        )}
      </main>

      {/* Chat Overlay */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Overlay Background for Chat */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsChatOpen(false)}
        />
      )}
      
    </div>
  );
};

export default App;