import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Paperclip, FileSpreadsheet, Loader2 } from "lucide-react";
import type { ReportTemplate } from "@/data/templateData";
import { toast } from "sonner";

interface ReportModalProps {
  template: ReportTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReportModal({ template, open, onOpenChange }: ReportModalProps) {
  const [reportPeriod, setReportPeriod] = useState("");
  const [plant, setPlant] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDownload = (format: "excel" | "pdf") => {
    if (!file && template?.section === "dynamic") {
      toast.error("Please upload a data file first");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Generate a sample report file
      const content = [
        `${template?.title}`,
        `Report Period: ${reportPeriod || "N/A"}`,
        `Plant / Location: ${plant || "All"}`,
        `Prepared By: ${preparedBy || "N/A"}`,
        `Approved By: ${approvedBy || "N/A"}`,
        `Data Source: ${file?.name || "Template Default"}`,
        "",
        "--- Report Data ---",
        "This report would be dynamically generated from the uploaded data source.",
        "Connect Lovable Cloud for full report generation with data parsing and KPI calculations.",
      ].join("\n");

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template?.title.replace(/\s+/g, "_")}.${format === "excel" ? "xlsx" : "pdf"}`;
      a.click();
      URL.revokeObjectURL(url);
      setLoading(false);
      toast.success(`${format === "excel" ? "Excel" : "PDF"} report downloaded`);
    }, 1500);
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            {template.title}
          </DialogTitle>
          <DialogDescription>{template.subtitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-semibold mb-1.5 block">Report Period</Label>
              <Input type="month" value={reportPeriod} onChange={(e) => setReportPeriod(e.target.value)} className="text-sm" />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-1.5 block">Plant / Location</Label>
              <Input value={plant} onChange={(e) => setPlant(e.target.value)} placeholder="e.g., Plant A" className="text-sm" />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-1.5 block">Prepared By</Label>
              <Input value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} placeholder="Your name" className="text-sm" />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-1.5 block">Approved By</Label>
              <Input value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)} placeholder="Approver name" className="text-sm" />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label className="text-sm font-semibold mb-1.5 block">
              <Paperclip className="inline h-3.5 w-3.5 mr-1" />
              Upload Data File (Excel / CSV)
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

          {/* Download Buttons */}
          <div className="flex gap-3">
            <Button onClick={() => handleDownload("excel")} disabled={loading} className="flex-1 gap-2 h-11">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download Excel Report
            </Button>
            <Button onClick={() => handleDownload("pdf")} disabled={loading} variant="outline" className="flex-1 gap-2 h-11">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
