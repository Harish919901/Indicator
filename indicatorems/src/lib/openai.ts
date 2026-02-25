const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are an AI assistant for an EMS (Electronics Manufacturing Services) platform called IndicatorEMS. You are an expert in:
- Electronics manufacturing, PCB assembly, SMT processes
- Supply chain management, procurement, vendor management
- BOM (Bill of Materials) analysis, component sourcing
- Quality control (IQC, OQC), production planning
- ERP/SAP integration for manufacturing
- Cost analysis, spend analytics, commodity management
- Lead time tracking, inventory management
- RFQ (Request for Quote) processes

When the user uploads a document, analyze its contents thoroughly and provide insights.
When answering general manufacturing questions, be specific, actionable, and data-driven.
Keep responses concise but informative. Use bullet points and bold text for clarity.
If data is provided, reference specific numbers and give recommendations.`;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

let conversationHistory: ChatMessage[] = [
  { role: "system", content: SYSTEM_PROMPT },
];

export function resetConversation() {
  conversationHistory = [
    { role: "system", content: SYSTEM_PROMPT },
  ];
}

export function addDocumentContext(fileName: string, content: string) {
  conversationHistory.push({
    role: "system",
    content: `The user has uploaded a document named "${fileName}". Here are the contents:\n\n${content}\n\nAnalyze this document and be ready to answer questions about it. Provide a brief summary of what you found.`,
  });
}

export async function sendMessage(userMessage: string): Promise<string> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_openai_api_key_here") {
    throw new Error("OpenAI API key not configured. Please add your key to the .env file.");
  }

  conversationHistory.push({ role: "user", content: userMessage });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: conversationHistory,
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const assistantMessage = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

  conversationHistory.push({ role: "assistant", content: assistantMessage });

  return assistantMessage;
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      // Truncate very large files to avoid token limits
      resolve(text.slice(0, 15000));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));

    if (
      file.type === "text/csv" ||
      file.type === "text/plain" ||
      file.type === "application/json" ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".json")
    ) {
      reader.readAsText(file);
    } else {
      // For xlsx/pdf/binary files, read as text (best effort)
      reader.readAsText(file);
    }
  });
}
