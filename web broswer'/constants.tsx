
import { MockPage } from './types';

export const SYSTEM_PROMPT = `You are an AI-powered Web Browser Assistant embedded inside a desktop browser.
Your role is NOT to browse like a human, but to:
- Understand user intent
- Analyze the current webpage (DOM, URL, visible text)
- Plan browser actions
- Execute actions safely and efficiently
- Return clear results to the user

========================
CORE CAPABILITIES
========================
You can:
1. Read and summarize the current webpage
2. Navigate to URLs
3. Click buttons and links
4. Fill forms and input fields
5. Scroll pages
6. Extract structured information
7. Automate multi-step workflows
8. Explain what actions you are performing

========================
INPUT YOU RECEIVE
========================
You will receive:
- User prompt (natural language)
- Current URL
- Page DOM snapshot
- Page visible text

========================
ACTION OUTPUT FORMAT
========================
If browser actions are required, respond ONLY in valid JSON:

{
  "intent": "<intent_name>",
  "description": "<short explanation>",
  "steps": [
    {
      "type": "navigate | click | type | scroll | wait | extract",
      "selector": "<css selector or xpath>",
      "value": "<text to type if needed>",
      "waitTime": "<milliseconds if needed>"
    }
  ]
}

- Be precise and deterministic.
- Never hallucinate selectors; only use selectors present in the DOM provided.
- If the user asks for information already in the DOM, use "extract".
- If a click leads to a new page, use "navigate".
- Provide brief, clear explanations in the description field.`;

export const MOCK_PAGES: Record<string, MockPage> = {
  'https://dashboard.io': {
    url: 'https://dashboard.io',
    title: 'Enterprise Dashboard',
    content: 'Welcome back. Your quarterly revenue is up by 12%. Recent invoices are ready for download.',
    dom: '<div id="app"><header><h1>Enterprise Dashboard</h1></header><main><p>Quarterly Revenue: $450,000</p><button id="btn-invoices" class="primary">View Invoices</button><button id="btn-settings" class="secondary">Settings</button></main></div>',
    interactiveElements: [
      { selector: '#btn-invoices', text: 'View Invoices', targetUrl: 'https://dashboard.io/invoices', type: 'button' },
      { selector: '#btn-settings', text: 'Settings', targetUrl: 'https://dashboard.io/settings', type: 'button' }
    ]
  },
  'https://dashboard.io/invoices': {
    url: 'https://dashboard.io/invoices',
    title: 'Your Invoices',
    content: 'Here are your recent invoices. Invoice #8842 - $1,200 (Paid). Invoice #8843 - $450 (Pending).',
    dom: '<div id="app"><h2>Invoices</h2><ul><li id="inv-8842">Invoice #8842 - $1,200 <button class="dl-btn" id="dl-8842">Download PDF</button></li><li id="inv-8843">Invoice #8843 - $450 <button class="dl-btn" id="dl-8843">Download PDF</button></li></ul><a href="https://dashboard.io" id="back-home">Back to Dashboard</a></div>',
    interactiveElements: [
      { selector: '#dl-8842', text: 'Download Invoice 8842', type: 'button' },
      { selector: '#dl-8843', text: 'Download Invoice 8843', type: 'button' },
      { selector: '#back-home', text: 'Back to Dashboard', targetUrl: 'https://dashboard.io', type: 'link' }
    ]
  },
  'https://shop.gemini.ai': {
    url: 'https://shop.gemini.ai',
    title: 'AI Hardware Store',
    content: 'The new Neural Core X1 is now in stock. Fast, efficient, and locally powered.',
    dom: '<div id="store"><nav><a href="https://shop.gemini.ai/cart" id="cart-link">Cart (0)</a></nav><section id="hero"><h1>Neural Core X1</h1><p>Price: $299.00</p><button id="add-to-cart" data-id="x1">Add to Cart</button></section></div>',
    interactiveElements: [
      { selector: '#add-to-cart', text: 'Add to Cart', type: 'button' },
      { selector: '#cart-link', text: 'Go to Cart', targetUrl: 'https://shop.gemini.ai/cart', type: 'link' }
    ]
  },
  'https://shop.gemini.ai/cart': {
    url: 'https://shop.gemini.ai/cart',
    title: 'Shopping Cart',
    content: 'Your cart is currently empty. Explore our latest hardware components.',
    dom: '<div id="cart"><h1>Your Cart</h1><div id="cart-items">Empty</div><button id="checkout" disabled>Checkout</button><a href="https://shop.gemini.ai" id="continue-shopping">Continue Shopping</a></div>',
    interactiveElements: [
      { selector: '#continue-shopping', text: 'Continue Shopping', targetUrl: 'https://shop.gemini.ai', type: 'link' }
    ]
  }
};
