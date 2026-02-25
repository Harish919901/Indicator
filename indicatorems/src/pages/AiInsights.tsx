import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, Send, BarChart3, AlertTriangle, TrendingUp, Zap, FileText, Sparkles, Paperclip, CloudUpload, BookOpen, File, FileSpreadsheet, FileImage, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendMessage, readFileAsText, addDocumentContext, resetConversation } from "@/lib/openai";

interface Message {
  role: "user" | "ai";
  content: string;
}

const sampleQueries = [
  "What are common causes of solder bridging in SMT assembly?",
  "How to reduce component lead times in EMS?",
  "Best practices for BOM cost optimization",
  "Explain IQC inspection process for PCBAs",
];

const initialMessages: Message[] = [
  { role: "ai", content: "Hi! I'm your AI Insights assistant I can:\n\n- **Analyze uploaded documents** (CSV, TXT, JSON) and answer questions about them\n- **Answer manufacturing questions** about EMS, PCB assembly, supply chain, procurement, and more\n\nUpload a file or ask me anything!" },
];

const oneDriveFiles = [
  { name: "Q1_BOM_Assembly.xlsx", size: "2.4 MB", icon: FileSpreadsheet, date: "Feb 20, 2026" },
  { name: "Supplier_Scorecard_2026.xlsx", size: "1.1 MB", icon: FileSpreadsheet, date: "Feb 18, 2026" },
  { name: "Component_Inventory.csv", size: "840 KB", icon: File, date: "Feb 15, 2026" },
  { name: "PCB_Layout_Rev3.pdf", size: "5.6 MB", icon: File, date: "Feb 12, 2026" },
];

const googleDriveFiles = [
  { name: "Procurement_Dashboard_Data.xlsx", size: "3.2 MB", icon: FileSpreadsheet, date: "Feb 22, 2026" },
  { name: "Vendor_Comparison_Report.xlsx", size: "1.8 MB", icon: FileSpreadsheet, date: "Feb 19, 2026" },
  { name: "RFQ_Responses_Batch4.csv", size: "620 KB", icon: File, date: "Feb 16, 2026" },
  { name: "Production_Schedule_Mar.pdf", size: "2.1 MB", icon: File, date: "Feb 14, 2026" },
];

const notebookLMItems = [
  { name: "EMS Supply Chain Analysis", sources: 12, date: "Feb 24, 2026", summary: "Key insights from supply chain data across 8 suppliers" },
  { name: "Component Lead Time Study", sources: 8, date: "Feb 20, 2026", summary: "Analysis of lead time trends for critical ICs and passives" },
  { name: "Cost Optimization Research", sources: 15, date: "Feb 17, 2026", summary: "Procurement cost reduction strategies and vendor alternatives" },
  { name: "Quality Metrics Overview", sources: 6, date: "Feb 13, 2026", summary: "IQC pass rates and quality yield tracking across product lines" },
];

export default function AiInsights() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oneDriveOpen, setOneDriveOpen] = useState(false);
  const [googleDriveOpen, setGoogleDriveOpen] = useState(false);
  const [notebookLMOpen, setNotebookLMOpen] = useState(false);
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(text);
      setMessages((m) => [...m, { role: "ai", content: response }]);
    } catch (error: any) {
      const errorMsg = error.message || "Failed to get response from AI.";
      toast.error(errorMsg);
      setMessages((m) => [...m, { role: "ai", content: `**Error:** ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userMsg: Message = { role: "user", content: `Uploaded: **${file.name}** (${(file.size / 1024).toFixed(0)} KB)` };
    setMessages((m) => [...m, userMsg]);
    setIsLoading(true);
    toast.info(`Reading "${file.name}"...`);

    try {
      const fileContent = await readFileAsText(file);
      addDocumentContext(file.name, fileContent);
      const response = await sendMessage(`I just uploaded a file called "${file.name}". Please analyze its contents and give me a summary of what you found — key data points, structure, and any immediate insights.`);
      setMessages((m) => [...m, { role: "ai", content: response }]);
      toast.success(`"${file.name}" analyzed successfully`);
    } catch (error: any) {
      const errorMsg = error.message || "Failed to analyze file.";
      toast.error(errorMsg);
      setMessages((m) => [...m, { role: "ai", content: `**Error analyzing file:** ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  const handleCloudFilePick = (fileName: string, source: string) => {
    setLoadingFile(fileName);
    setTimeout(() => {
      setLoadingFile(null);
      if (source === "OneDrive") setOneDriveOpen(false);
      if (source === "Google Drive") setGoogleDriveOpen(false);
      toast.success(`Imported "${fileName}" from ${source}`);
      const userMsg: Message = { role: "user", content: `Imported from ${source}: **${fileName}**` };
      setMessages((m) => [...m, userMsg]);
      setIsLoading(true);
      sendMessage(`The user imported a file called "${fileName}" from ${source}. Since this is a mock import, provide a realistic analysis of what this type of file would typically contain in an EMS context, and suggest what questions the user might want to ask about it.`)
        .then((response) => {
          setMessages((m) => [...m, { role: "ai", content: response }]);
        })
        .catch((error: any) => {
          toast.error(error.message);
          setMessages((m) => [...m, { role: "ai", content: `**Error:** ${error.message}` }]);
        })
        .finally(() => setIsLoading(false));
    }, 1500);
  };

  const handleNotebookPick = (name: string, summary: string) => {
    setLoadingFile(name);
    setTimeout(() => {
      setLoadingFile(null);
      setNotebookLMOpen(false);
      toast.success(`Loaded notebook: "${name}"`);
      const userMsg: Message = { role: "user", content: `Loaded NotebookLM: **${name}**` };
      setMessages((m) => [...m, userMsg]);
      setIsLoading(true);
      sendMessage(`The user loaded a NotebookLM notebook called "${name}" with this summary: "${summary}". Provide an in-depth analysis based on this topic in an EMS manufacturing context and suggest follow-up questions.`)
        .then((response) => {
          setMessages((m) => [...m, { role: "ai", content: response }]);
        })
        .catch((error: any) => {
          toast.error(error.message);
          setMessages((m) => [...m, { role: "ai", content: `**Error:** ${error.message}` }]);
        })
        .finally(() => setIsLoading(false));
    }, 1500);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo"><Brain className="h-6 w-6 text-primary" /> AI Insights</h1>
          <p className="text-sm font-semibold text-muted-foreground">Conversational AI for data analysis and actionable insights.</p>
        </div>

        <Card className="flex-1 flex flex-col card-premium border-0 overflow-hidden">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                    msg.role === "user"
                      ? "bg-indigo text-indigo-foreground shadow-md"
                      : "bg-muted/60 border border-border/50"
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl p-4 text-sm bg-muted/60 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested */}
          <div className="px-4 pb-3 flex gap-2 flex-wrap">
            {sampleQueries.map((q) => (
              <Button key={q} variant="outline" size="sm" className="text-xs rounded-full font-semibold hover:bg-primary/5 hover:border-primary/40" onClick={() => handleSend(q)} disabled={isLoading}>
                <Sparkles className="h-3 w-3 mr-1 text-primary" />{q}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-muted/20 space-y-2">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your data or manufacturing…"
                className="rounded-full bg-background border-border/60 focus-visible:ring-primary/30"
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                disabled={isLoading}
              />
              <Button onClick={() => handleSend(input)} size="icon" className="rounded-full shrink-0 btn-glow" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".csv,.xlsx,.xls,.pdf,.txt,.json"
              />
              <Button variant="outline" size="sm" className="text-xs rounded-full font-semibold gap-1.5 hover:bg-primary/5 hover:border-primary/40" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <Paperclip className="h-3.5 w-3.5" />Upload Attachment
              </Button>
              <Button variant="outline" size="sm" className="text-xs rounded-full font-semibold gap-1.5 hover:bg-primary/5 hover:border-primary/40" onClick={() => setOneDriveOpen(true)} disabled={isLoading}>
                <CloudUpload className="h-3.5 w-3.5" />OneDrive
              </Button>
              <Button variant="outline" size="sm" className="text-xs rounded-full font-semibold gap-1.5 hover:bg-primary/5 hover:border-primary/40" onClick={() => setGoogleDriveOpen(true)} disabled={isLoading}>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
                Google Drive
              </Button>
              <Button variant="outline" size="sm" className="text-xs rounded-full font-semibold gap-1.5 hover:bg-primary/5 hover:border-primary/40" onClick={() => setNotebookLMOpen(true)} disabled={isLoading}>
                <BookOpen className="h-3.5 w-3.5" />NotebookLM
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar Panels */}
      <div className="w-72 hidden lg:flex flex-col gap-5">
        <Card className="card-premium border-0 gradient-card-amber">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber" />Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-amber/10 border border-amber/20">
              <p className="font-bold text-foreground">TUSB320IRWBR — 130d lead time</p>
              <p className="text-muted-foreground font-semibold">Exceeds 120-day threshold</p>
            </div>
            <div className="p-3 rounded-lg bg-background border">
              <p className="font-bold text-foreground">Production cost variance +8%</p>
              <p className="text-muted-foreground font-semibold">Department: PP — last 30 days</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium border-0 gradient-card-warm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
              <p className="font-bold text-foreground">Passive component costs ↓ 5.2%</p>
              <p className="text-muted-foreground font-semibold">Month-over-month improvement</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
              <p className="font-bold text-foreground">Order volume ↑ 12%</p>
              <p className="text-muted-foreground font-semibold">Driven by EMEA region growth</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OneDrive Dialog */}
      <Dialog open={oneDriveOpen} onOpenChange={setOneDriveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CloudUpload className="h-5 w-5 text-blue-500" />OneDrive — Select a File</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {oneDriveFiles.map((f) => (
              <button
                key={f.name}
                onClick={() => handleCloudFilePick(f.name, "OneDrive")}
                disabled={!!loadingFile}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border hover:bg-primary/5 hover:border-primary/30 transition-all text-left disabled:opacity-50"
              >
                <f.icon className="h-5 w-5 text-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.size} — {f.date}</p>
                </div>
                {loadingFile === f.name ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Check className="h-4 w-4 text-muted-foreground/30" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Google Drive Dialog */}
      <Dialog open={googleDriveOpen} onOpenChange={setGoogleDriveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
              Google Drive — Select a File
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {googleDriveFiles.map((f) => (
              <button
                key={f.name}
                onClick={() => handleCloudFilePick(f.name, "Google Drive")}
                disabled={!!loadingFile}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border hover:bg-primary/5 hover:border-primary/30 transition-all text-left disabled:opacity-50"
              >
                <f.icon className="h-5 w-5 text-green-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.size} — {f.date}</p>
                </div>
                {loadingFile === f.name ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Check className="h-4 w-4 text-muted-foreground/30" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* NotebookLM Dialog */}
      <Dialog open={notebookLMOpen} onOpenChange={setNotebookLMOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-purple-500" />NotebookLM — Select a Notebook</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {notebookLMItems.map((n) => (
              <button
                key={n.name}
                onClick={() => handleNotebookPick(n.name, n.summary)}
                disabled={!!loadingFile}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border hover:bg-primary/5 hover:border-primary/30 transition-all text-left disabled:opacity-50"
              >
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{n.name}</p>
                  <p className="text-xs text-muted-foreground">{n.sources} sources — {n.date}</p>
                  <p className="text-xs text-muted-foreground/80 truncate mt-0.5">{n.summary}</p>
                </div>
                {loadingFile === n.name ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Check className="h-4 w-4 text-muted-foreground/30" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
