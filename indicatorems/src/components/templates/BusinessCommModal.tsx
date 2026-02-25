import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Download } from "lucide-react";
import type { BusinessCommTemplate } from "@/data/templateData";
import { toast } from "sonner";

interface BusinessCommModalProps {
  template: BusinessCommTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BusinessCommModal({ template, open, onOpenChange }: BusinessCommModalProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (template && open) {
      const defaults: Record<string, string> = {};
      template.fields.forEach((f) => (defaults[f.key] = ""));
      setFormValues(defaults);
    }
  }, [template, open]);

  if (!template) return null;

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const getPreview = () => {
    let result = template.bodyTemplate;
    Object.entries(formValues).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value || `[${key}]`);
    });
    return result;
  };

  const handleDownload = (format: "word" | "pdf") => {
    const content = getPreview();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.title.replace(/\s+/g, "_")}.${format === "word" ? "doc" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as ${format === "word" ? "Word" : "PDF"} format`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo" />
            {template.title}
          </DialogTitle>
          <DialogDescription>{template.subtitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {template.fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <Label className="text-sm font-semibold mb-1.5 block">{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={formValues[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="text-sm"
                  />
                ) : (
                  <Input
                    type={field.type === "date" ? "date" : "text"}
                    value={formValues[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="text-sm"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Live Preview */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <Label className="text-sm font-semibold mb-2 block">Document Preview</Label>
            <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground/90">
              {getPreview()}
            </pre>
          </div>

          {/* Download Buttons */}
          <div className="flex gap-3">
            <Button onClick={() => handleDownload("word")} variant="outline" className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Download as Word
            </Button>
            <Button onClick={() => handleDownload("pdf")} className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
