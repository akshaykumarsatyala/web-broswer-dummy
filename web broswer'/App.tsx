
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AssistantPanel from './components/AssistantPanel';
import BrowserWindow from './components/BrowserWindow';
import { GeminiService } from './services/geminiService';
import { MOCK_PAGES } from './constants';
import { 
  BrowserState, 
  BrowserStep, 
  BrowserIntent, 
  LogEntry, 
  MockPage 
} from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<MockPage>(MOCK_PAGES['https://dashboard.io']);
  const [state, setState] = useState<BrowserState>(BrowserState.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentIntent, setCurrentIntent] = useState<BrowserIntent | null>(null);
  const [activeStep, setActiveStep] = useState<BrowserStep | null>(null);

  const gemini = useMemo(() => new GeminiService(), []);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info', details?: any) => {
    setLogs(prev => [...prev, {
      id: uuidv4(),
      timestamp: Date.now(),
      message,
      type,
      details
    }]);
  }, []);

  const handleActionTriggered = useCallback((selector: string) => {
    addLog(`User manual action: Clicked ${selector}`, 'info');
  }, [addLog]);

  const handleNavigate = useCallback((url: string) => {
    if (MOCK_PAGES[url]) {
      setCurrentPage(MOCK_PAGES[url]);
      addLog(`Navigated to ${url}`, 'success');
    } else {
      addLog(`Failed to navigate: ${url} not found in simulated web.`, 'error');
    }
  }, [addLog]);

  const executeSteps = useCallback(async (steps: BrowserStep[]) => {
    setState(BrowserState.EXECUTING);
    
    for (const step of steps) {
      setActiveStep(step);
      addLog(`Executing: ${step.type} on ${step.selector}`, 'info');

      // Simulate network/interaction latency
      await new Promise(resolve => setTimeout(resolve, step.waitTime || 1500));

      try {
        switch (step.type) {
          case 'click':
            const element = currentPage.interactiveElements.find(el => el.selector === step.selector);
            if (element) {
              addLog(`Simulated click success: ${step.selector}`, 'success');
              if (element.targetUrl) {
                handleNavigate(element.targetUrl);
              }
            } else {
              throw new Error(`Selector ${step.selector} not found on current page.`);
            }
            break;

          case 'navigate':
            if (step.value && MOCK_PAGES[step.value]) {
              handleNavigate(step.value);
            } else {
              throw new Error(`Destination ${step.value} is invalid.`);
            }
            break;

          case 'type':
            addLog(`Typed "${step.value}" into ${step.selector}`, 'success');
            break;

          case 'extract':
            const summary = await gemini.summarizePage(currentPage.content);
            addLog(`Extraction result: ${summary}`, 'ai');
            break;

          case 'wait':
            addLog(`Waited for ${step.waitTime}ms`, 'info');
            break;
        }
      } catch (err) {
        addLog(`Step failed: ${(err as Error).message}`, 'error');
        break; 
      }
    }

    setActiveStep(null);
    setCurrentIntent(null);
    setState(BrowserState.IDLE);
    addLog('Workflow completed.', 'success');
  }, [currentPage, addLog, handleNavigate, gemini]);

  const handleSendPrompt = useCallback(async (prompt: string) => {
    setState(BrowserState.PLANNING);
    addLog(`User input: "${prompt}"`, 'info');
    
    try {
      const intent = await gemini.planActions(prompt, currentPage);
      setCurrentIntent(intent);
      addLog(`AI Plan Ready: ${intent.intent}`, 'ai', intent);
      
      if (intent.steps.length > 0) {
        executeSteps(intent.steps);
      } else {
        addLog('AI determined no steps were necessary.', 'info');
        setState(BrowserState.IDLE);
      }
    } catch (error) {
      addLog(`Planning error: ${(error as Error).message}`, 'error');
      setState(BrowserState.IDLE);
    }
  }, [currentPage, gemini, addLog, executeSteps]);

  return (
    <div className="flex h-screen w-screen bg-[#f1f5f9] overflow-hidden p-6 gap-6">
      {/* Main Browser Viewport */}
      <main className="flex-1 min-w-0">
        <BrowserWindow 
          page={currentPage} 
          activeStep={activeStep}
          onNavigate={handleNavigate}
          onActionTriggered={handleActionTriggered}
        />
      </main>

      {/* Side Assistant Panel */}
      <aside className="h-full">
        <AssistantPanel 
          logs={logs} 
          state={state} 
          onSendPrompt={handleSendPrompt}
          currentIntent={currentIntent}
        />
      </aside>

      {/* Visual background accents */}
      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default App;
