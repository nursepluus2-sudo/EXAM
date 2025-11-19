import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 p-6">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full blur opacity-30 animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-full shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">PharmaMaster</h1>
        <p className="text-slate-500 text-lg">
          تسلط بر داروهای اورژانس: اپی‌نفرین، آتروپین، آدنوزین.
        </p>
        <p className="text-slate-400 text-sm">
          شامل ۲۰ سوال کلیدی امتحان به همراه تحلیل هوشمند Gemini.
        </p>
      </div>

      <button 
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-teal-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 hover:bg-teal-700 transform hover:scale-105 shadow-lg shadow-teal-500/30"
      >
        شروع آزمون
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:mr-4 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-2xl">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="text-teal-500 font-bold mb-1">فلش کارت</div>
          <div className="text-xs text-slate-400">یادگیری فعال با تکرار</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="text-purple-500 font-bold mb-1">هوش مصنوعی</div>
          <div className="text-xs text-slate-400">تحلیل عمیق با Gemini 3 Pro</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="text-blue-500 font-bold mb-1">آمار دقیق</div>
          <div className="text-xs text-slate-400">مشاهده نقاط ضعف و قوت</div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;