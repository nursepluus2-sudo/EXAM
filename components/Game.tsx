import React, { useState, useEffect } from 'react';
import { questions, Question } from '../data';
import { analyzeQuestionDeeply } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface GameProps {
  onExit: () => void;
}

const Game: React.FC<GameProps> = ({ onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [completed, setCompleted] = useState(false);
  const [thinkingLoading, setThinkingLoading] = useState(false);
  const [deepThought, setDeepThought] = useState<string | null>(null);
  
  // Shuffle questions on mount
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setGameQuestions(shuffled);
  }, []);

  const currentQ = gameQuestions[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setDeepThought(null); // Reset deep thought on flip
  };

  const handleRate = (success: boolean) => {
    setScore(prev => ({
      correct: prev.correct + (success ? 1 : 0),
      wrong: prev.wrong + (success ? 0 : 1)
    }));

    if (currentIndex < gameQuestions.length - 1) {
      setIsFlipped(false);
      setDeepThought(null);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    } else {
      setCompleted(true);
    }
  };

  const handleThinkingMode = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    if (deepThought) return;
    
    setThinkingLoading(true);
    const analysis = await analyzeQuestionDeeply(currentQ.question, currentQ.answer);
    setDeepThought(analysis);
    setThinkingLoading(false);
  };

  if (!currentQ) return <div className="text-center p-10">در حال بارگذاری...</div>;

  if (completed) {
    const data = [
      { name: 'پاسخ صحیح', value: score.correct, fill: '#10b981' },
      { name: 'نیاز به تلاش', value: score.wrong, fill: '#ef4444' },
    ];

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-xl text-center space-y-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-800">نتیجه آزمون</h2>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
               <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{fontFamily: 'Vazirmatn'}} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '10px', direction: 'rtl'}} />
              <Bar dataKey="value" barSize={40} radius={[4, 4, 4, 4]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xl">
          امتیاز شما: <span className="font-bold text-teal-600">{score.correct}</span> از {questions.length}
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
          >
            بازی مجدد
          </button>
          <button 
            onClick={onExit}
            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
          >
            خروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto relative">
      {/* Progress Bar */}
      <div className="mb-6 flex items-center justify-between text-sm text-slate-500 font-medium">
        <span>سوال {currentIndex + 1} از {gameQuestions.length}</span>
        <div className="flex gap-4">
          <span className="text-green-600">✓ {score.correct}</span>
          <span className="text-red-500">✗ {score.wrong}</span>
        </div>
      </div>

      {/* Card Container */}
      <div 
        className="group perspective-1000 w-full h-[500px] cursor-pointer"
        onClick={handleFlip}
      >
        <div className={`relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front (Question) */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center border-2 border-slate-100">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-6 ${
              currentQ.category === 'Epinephrine' ? 'bg-red-100 text-red-600' :
              currentQ.category === 'Atropine' ? 'bg-purple-100 text-purple-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {currentQ.category === 'Epinephrine' ? 'اپی‌نفرین' : 
               currentQ.category === 'Atropine' ? 'آتروپین' : 'آدنوزین'}
            </span>
            <h3 className="text-2xl font-bold text-slate-800 leading-relaxed">
              {currentQ.question}
            </h3>
            <div className="mt-8 text-slate-400 text-sm animate-bounce">
              برای دیدن پاسخ کلیک کنید
            </div>
          </div>

          {/* Back (Answer) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-800 text-white rounded-3xl p-8 flex flex-col items-center justify-between border-2 border-slate-700 overflow-y-auto custom-scrollbar">
            <div className="w-full">
               <div className="text-slate-400 text-sm mb-2 text-center">پاسخ صحیح:</div>
               <p className="text-lg text-center leading-8 font-medium">
                 {currentQ.answer}
               </p>
               
               {/* Thinking Mode Section */}
               <div className="mt-6 pt-6 border-t border-slate-700">
                  {!deepThought ? (
                    <button 
                      onClick={handleThinkingMode}
                      disabled={thinkingLoading}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 rounded-lg text-indigo-200 text-sm transition-all"
                    >
                      {thinkingLoading ? (
                         <span className="animate-pulse">در حال تفکر عمیق...</span>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          تحلیل عمیق و بالینی (Gemini Thinking)
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-500/30 text-xs text-indigo-100 leading-6 text-right">
                      <strong className="block text-indigo-300 mb-1">تحلیل بالینی:</strong>
                      {deepThought}
                    </div>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <button 
                onClick={(e) => { e.stopPropagation(); handleRate(false); }}
                className="py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/30"
              >
                بلد نبودم ✗
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleRate(true); }}
                className="py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold transition-colors shadow-lg shadow-teal-500/30"
              >
                بلد بودم ✓
              </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-8 text-center text-slate-400 text-sm">
         روی کارت کلیک کنید تا بچرخد. سپس وضعیت دانش خود را ثبت کنید.
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default Game;