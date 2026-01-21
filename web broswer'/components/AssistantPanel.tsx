
import React, { useRef, useEffect } from 'react';
import { Send, Bot, Terminal, CheckCircle2, AlertCircle, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { LogEntry, BrowserState, BrowserIntent } from '../types';

interface AssistantPanelProps {
  logs: LogEntry[];
  state: BrowserState;
  onSendPrompt: (prompt: string) => void;
  currentIntent: BrowserIntent | null;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({ logs, state, onSendPrompt, currentIntent }) => {
  const [input, setInput] = React.useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && state === BrowserState.IDLE) {
      onSendPrompt(input.trim());
      setInput('');
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'error': return <AlertCircle size={16} className="text-rose-500" />;
      case 'ai': return <Bot size={16} className="text-indigo-500" />;
      default: return <Terminal size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="w-[420px] h-full bg-white flex flex-col border-l border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Browser Agent</h2>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${state === BrowserState.IDLE ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {state.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        {state !== BrowserState.IDLE && (
          <div className="bg-slate-50 p-2 rounded-lg">
            <Loader2 size={18} className="text-indigo-600 animate-spin" />
          </div>
        )}
      </div>

      {/* Logs/Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
      >
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <div className="mb-4 p-4 rounded-full bg-slate-200">
              <Bot size={48} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-2">No activity yet</p>
            <p className="text-xs text-slate-400">Ask me to summarize the page or automate a specific workflow.</p>
          </div>
        )}

        {logs.map((log) => (
          <div key={log.id} className={`flex gap-3 group animate-in slide-in-from-left-2 duration-300`}>
            <div className="mt-1 flex-shrink-0">{getLogIcon(log.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-700 leading-relaxed">
                {log.message}
              </div>
              <div className="mt-1 text-[10px] text-slate-400 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              
              {log.details && (
                <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-mono text-slate-600 overflow-x-auto whitespace-pre">
                  {JSON.stringify(log.details, null, 2)}
                </div>
              )}
            </div>
          </div>
        ))}

        {currentIntent && state === BrowserState.EXECUTING && (
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-widest">
              <Wand2 size={14} />
              Active Workflow
            </div>
            <div className="text-sm font-semibold text-slate-800">{currentIntent.description}</div>
            <div className="space-y-1.5">
              {currentIntent.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`} />
                  <span className="text-slate-600 font-mono">{step.type}</span>
                  <span className="text-slate-400 truncate">{step.selector}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={state !== BrowserState.IDLE}
            placeholder="Type a command (e.g. 'download invoice 8842')"
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || state !== BrowserState.IDLE}
            className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-colors shadow-lg shadow-indigo-200"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="mt-3 text-[10px] text-center text-slate-400 font-medium uppercase tracking-tighter">
          Empowered by Gemini 3 Pro
        </p>
      </div>
    </div>
  );
};

export default AssistantPanel;
