
export type ActionType = 'navigate' | 'click' | 'type' | 'scroll' | 'wait' | 'extract';

export interface BrowserStep {
  type: ActionType;
  selector: string;
  value?: string;
  waitTime?: number;
}

export interface BrowserIntent {
  intent: string;
  description: string;
  steps: BrowserStep[];
}

export interface MockPage {
  url: string;
  title: string;
  content: string;
  dom: string;
  interactiveElements: {
    selector: string;
    text: string;
    targetUrl?: string;
    type: 'button' | 'link' | 'input';
  }[];
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'ai';
  details?: any;
}

export enum BrowserState {
  IDLE = 'idle',
  PLANNING = 'planning',
  EXECUTING = 'executing',
  ERROR = 'error'
}
