# 🌐 navuh Browser Agent

An intelligent, AI-powered web browser assistant that analyzes page content, plans multi-step automation workflows, and executes browser actions based on natural language commands.

Built with **React**, **Tailwind CSS**, and the **Google Gemini 3 API**.

## ✨ Features

- **Natural Language Intent**: Simply tell the assistant what you want to do (e.g., "Download my last invoice" or "Summarize the dashboard").
- **Multi-Step Planning**: Uses Gemini 3 Pro to decompose complex user requests into discrete browser actions (click, navigate, type, extract, wait).
- **Simulated Browser Environment**: A fully interactive "browser-within-a-browser" UI with address bar, tabs, and viewport.
- **Real-Time Execution Logs**: Watch the AI think and act in real-time through a dedicated terminal-style assistant panel.
- **DOM-Aware Logic**: The AI analyzes a snapshot of the page's DOM to ensure it only interacts with existing elements.
- **Aesthetic UI/UX**: Clean, modern interface using Tailwind CSS and Lucide icons.

## 🚀 Tech Stack

- **Frontend**: React (v19)
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 3 Pro (`gemini-3-pro-preview`)
- **Icons**: Lucide React
- **Runtime**: ESM-based browser environment

## 🛠️ Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/gemini-browser-agent.git
    cd gemini-browser-agent
    ```

2.  **Environment Variables**:
    This application requires a Google Gemini API Key. Ensure the key is available in your environment:
    ```bash
    export API_KEY=your_gemini_api_key_here
    ```

3.  **Run the application**:
    Since this project uses ESM modules directly in the browser, you can serve it using any local static file server (e.g., `npx serve .` or Live Server in VS Code).

## 🤖 How it Works

1.  **Input**: The user enters a natural language command in the Assistant Panel.
2.  **Planning**: The system sends the current URL, visible text, and DOM structure to Gemini 3 Pro.
3.  **Step Generation**: Gemini returns a JSON object containing a sequence of browser actions.
4.  **Execution**: The application iterates through the steps, simulating network latency and highlighting the elements being interacted with in the viewport.
5.  **Feedback**: Success/error logs are streamed back to the user interface.

## 📂 Project Structure

- `App.tsx`: Main logic controller and state management.
- `services/geminiService.ts`: Integration with `@google/genai` for planning and summarization.
- `components/BrowserWindow.tsx`: The visual browser simulation component.
- `components/AssistantPanel.tsx`: The sidebar containing chat history and system logs.
- `constants.tsx`: Contains the System Instruction prompt and mock website data.
- `types.ts`: TypeScript definitions for the automation engine.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
