
import React from 'react';
import { MockPage, BrowserStep } from '../types';
import { Search, RotateCw, ChevronLeft, ChevronRight, Share, Lock, ExternalLink } from 'lucide-react';

interface BrowserWindowProps {
  page: MockPage;
  activeStep: BrowserStep | null;
  onNavigate: (url: string) => void;
  onActionTriggered: (selector: string) => void;
}

const BrowserWindow: React.FC<BrowserWindowProps> = ({ page, activeStep, onNavigate, onActionTriggered }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
      {/* Browser Chrome */}
      <div className="bg-slate-100 p-2 flex items-center gap-3 border-b border-slate-200">
        <div className="flex gap-1.5 ml-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors">
            <ChevronRight size={18} />
          </button>
          <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors">
            <RotateCw size={16} />
          </button>
        </div>

        <div className="flex-1 max-w-2xl bg-white border border-slate-300 rounded-md py-1 px-3 flex items-center gap-2 text-sm text-slate-600 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <Lock size={12} className="text-emerald-500" />
          <span className="truncate flex-1">{page.url}</span>
          <RotateCw size={12} className="text-slate-400 cursor-pointer" />
        </div>

        <div className="flex gap-2 ml-auto mr-2">
          <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors">
            <Share size={18} />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-slate-100 px-2 flex items-center border-b border-slate-200 h-10">
        <div className="bg-white px-4 h-full flex items-center gap-2 rounded-t-lg border-x border-t border-slate-200 text-xs font-medium text-slate-700 min-w-[140px] shadow-[0_-2px_4px_rgba(0,0,0,0.02)]">
          <div className="w-4 h-4 rounded bg-indigo-500 flex items-center justify-center text-[10px] text-white">G</div>
          <span className="truncate">{page.title}</span>
        </div>
      </div>

      {/* Viewport Content */}
      <div className="flex-1 overflow-auto bg-slate-50 relative">
        <div className="max-w-4xl mx-auto p-12 bg-white min-h-full shadow-sm">
          <h1 className="text-4xl font-bold text-slate-800 mb-8 border-b pb-4">{page.title}</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed mb-12">
              {page.content}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {page.interactiveElements.map((el, i) => {
                const isExecuting = activeStep?.selector === el.selector;
                return (
                  <button
                    key={i}
                    id={el.selector.replace('#', '')}
                    onClick={() => {
                      if (el.targetUrl) onNavigate(el.targetUrl);
                      onActionTriggered(el.selector);
                    }}
                    className={`
                      p-6 text-left border-2 rounded-xl transition-all group relative
                      ${isExecuting 
                        ? 'border-indigo-600 ring-4 ring-indigo-100 bg-indigo-50' 
                        : 'border-slate-100 hover:border-indigo-300 hover:shadow-lg bg-white'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono font-medium text-indigo-500 uppercase tracking-wider">
                        {el.type}
                      </span>
                      <ExternalLink size={14} className="text-slate-300 group-hover:text-indigo-400" />
                    </div>
                    <div className="text-lg font-semibold text-slate-800">
                      {el.text}
                    </div>
                    <div className="mt-2 text-xs font-mono text-slate-400">
                      {el.selector}
                    </div>
                    
                    {isExecuting && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Overlay */}
        {activeStep && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl border border-white/10 z-50 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-sm font-medium uppercase tracking-wider">Executing {activeStep.type}</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-sm font-mono text-slate-300 truncate max-w-[200px]">
              {activeStep.selector}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserWindow;
