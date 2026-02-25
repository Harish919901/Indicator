import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paperclip, Sparkles, CalendarIcon, Loader2 } from "lucide-react";
import type { AIPromptTemplate } from "@/data/templateData";
import { toast } from "sonner";

interface AIPromptModalProps {
  template: AIPromptTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AIPromptModal({ template, open, onOpenChange }: AIPromptModalProps) {
  const [prompt, setPrompt] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Reset state when template changes
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && template) {
      setPrompt(template.prompt);
      setOutput("");
      setFile(null);
      setDateFilter("");
    }
    onOpenChange(isOpen);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    setLoading(true);
    // Simulate AI response since Cloud is not connected
    setTimeout(() => {
      setOutput(
        `📊 AI Analysis Result\n━━━━━━━━━━━━━━━━━━━\n\nBased on the provided data, here is the structured analysis:\n\n1. Key Findings:\n   • Finding 1: Data indicates strong performance in primary metrics\n   • Finding 2: Areas requiring attention identified in secondary KPIs\n   • Finding 3: Trend analysis shows improvement quarter-over-quarter\n\n2. Recommendations:\n   • Action Item 1: Immediate corrective action on flagged items\n   • Action Item 2: Schedule follow-up review in 2 weeks\n   • Action Item 3: Update reporting cadence to weekly\n\n3. Risk Assessment:\n   • Low Risk: 60% of items\n   • Medium Risk: 30% of items\n   • High Risk: 10% of items\n\n⚠️ Note: Connect Lovable Cloud for live AI-powered analysis with your actual data.`
      );
      setLoading(false);
      toast.success("Analysis generated successfully");
    }, 2000);
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {template.title}
          </DialogTitle>
          <DialogDescription>{template.subtitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Editable Prompt */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Prompt</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={8}
              className="text-sm font-mono leading-relaxed resize-y"
            />
          </div>

          {/* Attach + Date Filter Row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-sm font-semibold mb-1.5 block">
                <Paperclip className="inline h-3.5 w-3.5 mr-1" />
                Attach Data (Excel / CSV)
              </Label>
              <Input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-xs"
              />
              {file && <p className="text-xs text-muted-foreground mt-1">📎 {file.name}</p>}
            </div>
            <div className="w-48">
              <Label className="text-sm font-semibold mb-1.5 block">
                <CalendarIcon className="inline h-3.5 w-3.5 mr-1" />
                Date Filter (Optional)
              </Label>
              <Input
                type="month"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full gap-2 h-11 text-sm font-semibold"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate with AI"}
          </Button>

          {/* Output Panel */}
          {output && (
            <div className="rounded-xl border bg-muted/30 p-4">
              <Label className="text-sm font-semibold mb-2 block">AI Output</Label>
              <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed text-foreground/90">
                {output}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
