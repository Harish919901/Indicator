import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileSpreadsheet, AlertTriangle, Package, ClipboardList,
  TrendingUp, TrendingDown, BarChart3, Shield, Clock, DollarSign,
  CheckCircle2, XCircle, ArrowRight
} from "lucide-react";
import type { ReportTemplate } from "@/data/templateData";

interface Props {
  template: ReportTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseTemplate?: (template: ReportTemplate) => void;
}

// ─── Status badge helper ───
function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s.includes("critical") || s.includes("overdue") || s.includes("below target"))
    return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{status}</Badge>;
  if (s.includes("high") || s.includes("watch") || s.includes("near") || s.includes("at risk") || s.includes("monitor") || s.includes("medium"))
    return <Badge className="text-[10px] px-1.5 py-0 bg-amber text-amber-foreground">{status}</Badge>;
  if (s.includes("safe") || s.includes("on target") || s.includes("on track") || s.includes("preferred") || s.includes("healthy") || s.includes("low") || s.includes("complete"))
    return <Badge className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">{status}</Badge>;
  return <Badge variant="outline" className="text-[10px] px-1.5 py-0">{status}</Badge>;
}

function KPICard({ label, value, icon, trend }: { label: string; value: string; icon: React.ReactNode; trend?: "up" | "down" | "neutral" }) {
  return (
    <div className="rounded-lg border bg-card p-3 text-center shadow-sm">
      <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
        {icon}
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold tabular-nums">{value}</p>
      {trend && (
        <div className="flex items-center justify-center mt-0.5">
          {trend === "up" && <TrendingUp className="h-3 w-3 text-primary" />}
          {trend === "down" && <TrendingDown className="h-3 w-3 text-destructive" />}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-4 mb-2">{children}</h3>;
}

function DataTable({ columns, rows, statusCol }: { columns: string[]; rows: string[][]; statusCol?: number }) {
  return (
    <div className="rounded-lg border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-muted/60 border-b">
              {columns.map((col) => (
                <th key={col} className="px-2.5 py-2 text-left font-semibold whitespace-nowrap text-foreground">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={`${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-accent/30 transition-colors`}>
                {row.map((cell, j) => (
                  <td key={j} className="px-2.5 py-1.5 whitespace-nowrap tabular-nums">
                    {statusCol === j ? <StatusBadge status={cell} /> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REPORT 1: Component Shortage & Risk Report
// ═══════════════════════════════════════════════════════════
function ShortageRiskPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KPICard label="Total at Risk" value="241" icon={<AlertTriangle className="h-4 w-4" />} />
        <KPICard label="Critical" value="12" icon={<XCircle className="h-4 w-4 text-destructive" />} />
        <KPICard label="Revenue Exposure" value="$5.4M" icon={<DollarSign className="h-4 w-4" />} trend="down" />
        <KPICard label="Low Risk" value="156" icon={<Shield className="h-4 w-4" />} />
      </div>

      <SectionTitle>Risk Summary</SectionTitle>
      <DataTable
        columns={["Risk Level", "Count", "% of Total", "Revenue Impact", "Action Required"]}
        statusCol={0}
        rows={[
          ["CRITICAL", "12", "5.0%", "$2,450,000", "Immediate Escalation"],
          ["HIGH", "28", "11.6%", "$1,850,000", "Sourcing Review"],
          ["MEDIUM", "45", "18.7%", "$920,000", "Monitor Weekly"],
          ["LOW", "156", "64.7%", "$180,000", "Standard Review"],
        ]}
      />

      <SectionTitle>Component Shortage Detail</SectionTitle>
      <DataTable
        columns={["MPN", "Manufacturer", "Description", "Stock", "Safety Stock", "Lead Time", "Days of Supply", "Risk", "Alt Source", "Mitigation"]}
        statusCol={7}
        rows={[
          ["STM32F407VGT6", "STMicro", "ARM Cortex-M4 MCU", "450", "1,000", "52d", "5.3", "CRITICAL", "Yes", "Eval NXP LPC4078"],
          ["TPS65217C", "TI", "Power Mgmt IC", "280", "500", "42d", "4.3", "CRITICAL", "No", "Design change req'd"],
          ["ESP32-WROOM-32E", "Espressif", "WiFi/BT Module", "180", "400", "38d", "4.0", "CRITICAL", "Yes", "ESP32-S3 upgrade"],
          ["USB3320C-EZK", "Microchip", "USB 2.0 PHY", "120", "300", "45d", "4.3", "CRITICAL", "No", "Expedite w/ dist."],
          ["MLCC-100NF-50V", "Murata", "MLCC 100nF 50V", "125K", "80K", "18d", "14.7", "MEDIUM", "Yes", "Yageo alt qualified"],
          ["SN74LVC1G125", "TI", "Bus Buffer Gate", "8,500", "5,000", "14d", "20.2", "MEDIUM", "Yes", "Nexperia alt avail."],
        ]}
      />

      <SectionTitle>Mitigation Action Tracker</SectionTitle>
      <DataTable
        columns={["Action ID", "MPN", "Type", "Owner", "Due Date", "Status", "Progress"]}
        statusCol={5}
        rows={[
          ["MIT-001", "STM32F407VGT6", "Alt Qualification", "John Smith", "2026-03-15", "In Progress", "45%"],
          ["MIT-002", "TPS65217C", "Design Change", "Sarah Chen", "2026-04-01", "Planning", "15%"],
          ["MIT-003", "USB3320C-EZK", "Expedite", "Mike Johnson", "2026-02-28", "In Progress", "70%"],
          ["MIT-004", "ESP32-WROOM-32E", "Buffer Stock", "Lisa Wang", "2026-03-05", "Complete", "100%"],
        ]}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REPORT 2: Supplier Scorecard Report
// ═══════════════════════════════════════════════════════════
function SupplierScorecardPreview() {
  return (
    <div className="space-y-3">
      <div className="text-[11px] text-muted-foreground mb-2">
        <span className="font-semibold">KPI Weights:</span> Quality 25% · OTD 25% · Price 20% · Responsiveness 15% · Tech Support 10% · Flexibility 5%
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KPICard label="Suppliers Evaluated" value="10" icon={<ClipboardList className="h-4 w-4" />} />
        <KPICard label="Top Score" value="91.1%" icon={<TrendingUp className="h-4 w-4" />} />
        <KPICard label="Avg Score" value="88.1%" icon={<BarChart3 className="h-4 w-4" />} />
        <KPICard label="Preferred" value="2" icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <SectionTitle>Supplier Scorecard Matrix</SectionTitle>
      <DataTable
        columns={["Supplier", "Category", "Spend ($K)", "Quality", "OTD", "Price", "Response", "Tech", "Flex", "Score", "Rank", "Status"]}
        statusCol={11}
        rows={[
          ["TE Connectivity", "Connectors", "1,650", "94", "95", "85", "90", "88", "90", "91.1%", "#1", "Preferred"],
          ["Murata Mfg", "Passive", "2,850", "95", "92", "88", "90", "85", "82", "90.5%", "#2", "Preferred"],
          ["Texas Instruments", "Semicon.", "4,200", "98", "88", "75", "92", "95", "78", "88.7%", "#3", "Approved"],
          ["Samsung Electro", "Passive", "1,950", "88", "90", "92", "85", "80", "88", "88.1%", "#4", "Approved"],
          ["Microchip Tech", "Semicon.", "1,850", "94", "86", "82", "88", "90", "82", "87.7%", "#5", "Approved"],
        ]}
      />

      <SectionTitle>Detailed Supplier Metrics</SectionTitle>
      <DataTable
        columns={["Supplier", "Total POs", "On-Time", "OTD %", "Qty Recv'd", "PPM", "RMA", "Avg Lead Time", "Quote Resp."]}
        rows={[
          ["Murata Mfg", "245", "225", "91.8%", "1.85M", "100", "8", "18 days", "1.2 days"],
          ["Texas Instruments", "312", "275", "88.1%", "2.45M", "40", "5", "28 days", "0.8 days"],
          ["STMicroelectronics", "198", "168", "84.8%", "1.65M", "100", "12", "32 days", "1.5 days"],
          ["TE Connectivity", "134", "127", "94.8%", "720K", "90", "3", "14 days", "1.0 days"],
        ]}
      />

      <SectionTitle>Quarterly Performance Trends</SectionTitle>
      <DataTable
        columns={["Supplier", "Metric", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Trend", "YoY"]}
        rows={[
          ["Murata Mfg", "OTD %", "88.0%", "90.0%", "91.0%", "92.0%", "↑", "+4.5%"],
          ["Murata Mfg", "Quality PPM", "125", "112", "108", "100", "↑", "+20.0%"],
          ["Texas Instruments", "OTD %", "82.0%", "84.0%", "86.0%", "88.0%", "↑", "+7.3%"],
          ["Texas Instruments", "Quality PPM", "52", "48", "45", "40", "↑", "+23.1%"],
        ]}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REPORT 3: Spend by Commodity Report
// ═══════════════════════════════════════════════════════════
function SpendCommodityPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KPICard label="Total FY2025 Spend" value="$35.8M" icon={<DollarSign className="h-4 w-4" />} />
        <KPICard label="YoY Growth" value="+8.8%" icon={<TrendingUp className="h-4 w-4" />} trend="up" />
        <KPICard label="Commodity Groups" value="12" icon={<Package className="h-4 w-4" />} />
        <KPICard label="Active Suppliers" value="73" icon={<ClipboardList className="h-4 w-4" />} />
      </div>

      <SectionTitle>Commodity Spend Overview</SectionTitle>
      <DataTable
        columns={["Commodity", "FY2024", "FY2025", "YoY $", "YoY %", "% of Total", "Suppliers", "Top Supplier", "Top %"]}
        rows={[
          ["Semiconductors - ICs", "$8.5M", "$9.2M", "+$700K", "+8.2%", "25.7%", "12", "Texas Instruments", "32%"],
          ["Passive - Capacitors", "$3.2M", "$3.45M", "+$250K", "+7.8%", "9.6%", "8", "Murata", "45%"],
          ["PCB & Substrates", "$4.1M", "$4.35M", "+$250K", "+6.1%", "12.1%", "4", "TTM Technologies", "48%"],
          ["Power Management", "$2.8M", "$3.1M", "+$300K", "+10.7%", "8.7%", "7", "Texas Instruments", "35%"],
          ["Connectors", "$2.4M", "$2.68M", "+$280K", "+11.7%", "7.5%", "5", "TE Connectivity", "52%"],
          ["Modules - Wireless", "$1.95M", "$2.28M", "+$330K", "+16.9%", "6.4%", "3", "Espressif", "65%"],
          ["Memory ICs", "$3.6M", "$3.85M", "+$250K", "+6.9%", "10.7%", "5", "Samsung", "55%"],
        ]}
      />

      <SectionTitle>Top Supplier Detail</SectionTitle>
      <DataTable
        columns={["Supplier", "Commodity", "FY2024", "FY2025", "Change %", "PO Count", "Avg PO Value", "Terms", "Contract End"]}
        rows={[
          ["Texas Instruments", "Semiconductors", "$2.85M", "$3.15M", "+10.5%", "185", "$17,027", "Net 45", "2026-12-31"],
          ["Murata Mfg", "Passive - Cap", "$1.45M", "$1.55M", "+6.9%", "120", "$12,917", "Net 30", "2027-06-30"],
          ["STMicroelectronics", "Semiconductors", "$2.2M", "$2.45M", "+11.4%", "142", "$17,254", "Net 45", "2026-09-30"],
          ["TE Connectivity", "Connectors", "$1.38M", "$1.52M", "+10.1%", "95", "$16,000", "Net 30", "2027-03-31"],
          ["Samsung", "Memory ICs", "$1.98M", "$2.12M", "+7.1%", "78", "$27,179", "Net 60", "2026-06-30"],
        ]}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REPORT 4: PO Aging & Open PO Tracker
// ═══════════════════════════════════════════════════════════
function POAgingPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KPICard label="Open POs" value="276" icon={<ClipboardList className="h-4 w-4" />} />
        <KPICard label="Total Value" value="$5.6M" icon={<DollarSign className="h-4 w-4" />} />
        <KPICard label="Avg PO Age" value="42.7 days" icon={<Clock className="h-4 w-4" />} />
        <KPICard label="Requiring Escalation" value="63" icon={<AlertTriangle className="h-4 w-4 text-destructive" />} />
      </div>

      <SectionTitle>Aging Summary</SectionTitle>
      <DataTable
        columns={["Aging Bucket", "PO Count", "Total Value", "% of Total", "Escalation Level", "Action Required"]}
        statusCol={4}
        rows={[
          ["Current (0-30 days)", "145", "$2,850,000", "50.8%", "None", "Standard Processing"],
          ["31-60 days", "68", "$1,420,000", "25.3%", "Level 1", "Buyer Follow-up"],
          ["61-90 days", "32", "$680,000", "12.1%", "Level 2", "Manager Review"],
          ["91-120 days", "18", "$390,000", "7.0%", "Level 3", "Director Escalation"],
          ["121-180 days", "8", "$175,000", "3.1%", "CRITICAL", "VP Escalation"],
          [">180 days", "5", "$95,000", "1.7%", "CRITICAL", "Executive Action"],
        ]}
      />

      <SectionTitle>Open PO Detail</SectionTitle>
      <DataTable
        columns={["PO Number", "Supplier", "MPN", "PO Date", "Due Date", "Days Open", "Open Qty", "Open Value", "Status", "Buyer", "Flag"]}
        statusCol={10}
        rows={[
          ["PO-2025-4102", "Microchip", "USB3320C-EZK", "2025-07-20", "2025-09-15", "220", "2,000", "$6,900", "Partial - Critical", "Sarah Chen", "CRITICAL"],
          ["PO-2025-4215", "NXP", "LPC4078FBD80", "2025-08-15", "2025-10-01", "194", "1,500", "$10,200", "Partial - Delayed", "John Smith", "CRITICAL"],
          ["PO-2025-4521", "TI", "TPS65217C", "2025-10-15", "2025-12-01", "133", "1,800", "$5,130", "Partial Receipt", "John Smith", "HIGH"],
          ["PO-2025-4598", "STMicro", "STM32F407VGT6", "2025-11-01", "2025-12-15", "116", "2,000", "$17,000", "Open", "Sarah Chen", "HIGH"],
          ["PO-2025-4612", "Murata", "GRM188R71H", "2025-11-10", "2025-12-20", "107", "25,000", "$625", "Partial Receipt", "Mike Johnson", "HIGH"],
        ]}
      />

      <SectionTitle>Escalation Dashboard</SectionTitle>
      <DataTable
        columns={["Priority", "PO Number", "Supplier", "Value", "Days Overdue", "Issue", "Action Taken", "Owner"]}
        statusCol={0}
        rows={[
          ["CRITICAL", "PO-2025-4102", "Microchip", "$6,900", "163", "Allocation issue", "VP call scheduled", "Sarah Chen"],
          ["CRITICAL", "PO-2025-4215", "NXP", "$10,200", "147", "Capacity constraint", "Alt source qualifying", "John Smith"],
          ["HIGH", "PO-2025-4521", "TI", "$5,130", "86", "Partial shipment delay", "Weekly follow-up", "John Smith"],
          ["MEDIUM", "PO-2025-4598", "STMicro", "$17,000", "72", "Lead time extension", "New date confirmed", "Sarah Chen"],
        ]}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REPORT 5: Inventory Turnover Report
// ═══════════════════════════════════════════════════════════
function InventoryTurnoverPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KPICard label="Total Avg Inventory" value="$5.6M" icon={<Package className="h-4 w-4" />} />
        <KPICard label="Annual COGS" value="$30.8M" icon={<DollarSign className="h-4 w-4" />} />
        <KPICard label="Wtd Avg Turnover" value="5.5x" icon={<TrendingUp className="h-4 w-4" />} />
        <KPICard label="Avg Days of Supply" value="66" icon={<Clock className="h-4 w-4" />} />
      </div>

      <SectionTitle>Turnover by Commodity</SectionTitle>
      <DataTable
        columns={["Commodity", "Avg Inventory", "Annual COGS", "Turnover", "Days of Supply", "Target", "Variance", "Status"]}
        statusCol={7}
        rows={[
          ["Semiconductors - ICs", "$1,850,000", "$9,200,000", "5.0x", "73", "6.0x", "-1.0", "Below Target"],
          ["Passive - Capacitors", "$620,000", "$3,450,000", "5.6x", "66", "5.5x", "+0.1", "On Target"],
          ["Passive - Resistors", "$280,000", "$1,920,000", "6.9x", "53", "7.0x", "-0.1", "Near Target"],
          ["Connectors", "$485,000", "$2,680,000", "5.5x", "66", "5.0x", "+0.5", "On Target"],
          ["PCB & Substrates", "$750,000", "$4,350,000", "5.8x", "63", "6.0x", "-0.2", "Near Target"],
          ["Modules - Wireless", "$380,000", "$2,280,000", "6.0x", "61", "6.0x", "0.0", "On Target"],
          ["Power Management", "$520,000", "$3,100,000", "6.0x", "61", "6.0x", "0.0", "Near Target"],
          ["Memory ICs", "$680,000", "$3,850,000", "5.7x", "64", "5.5x", "+0.2", "On Target"],
        ]}
      />

      <SectionTitle>Turnover by Location</SectionTitle>
      <DataTable
        columns={["Location", "Code", "Avg Inventory", "Annual Usage", "Turnover", "Days of Supply", "Capacity %", "Status"]}
        statusCol={7}
        rows={[
          ["Chennai - Main", "CHN-01", "$2,450,000", "$14,500,000", "5.9x", "62", "78%", "Healthy"],
          ["Chennai - Overflow", "CHN-02", "$680,000", "$3,200,000", "4.7x", "78", "45%", "Monitor"],
          ["Bangalore", "BLR-01", "$1,850,000", "$9,800,000", "5.3x", "69", "82%", "Healthy"],
          ["Hyderabad", "HYD-01", "$920,000", "$4,500,000", "4.9x", "75", "65%", "Monitor"],
          ["Singapore Hub", "SIN-01", "$1,250,000", "$5,800,000", "4.6x", "79", "72%", "Monitor"],
        ]}
      />

      <SectionTitle>Slow Moving & Excess Inventory</SectionTitle>
      <DataTable
        columns={["MPN", "Description", "Commodity", "Location", "On Hand Qty", "Value", "Turnover", "Days of Supply", "Recommendation"]}
        rows={[
          ["OLD-MCU-001", "Legacy MCU", "Semiconductors", "CHN-01", "2,500", "$18,750", "0.3x", "1,267", "Scrap - No future demand"],
          ["CONN-LEGACY-X", "Obsolete Connector", "Connectors", "BLR-01", "8,500", "$12,750", "1.1x", "323", "Return to supplier"],
          ["IC-POWER-OLD", "Replaced by newer", "Power", "HYD-01", "1,800", "$9,000", "1.1x", "342", "Discount sale - 50%"],
          ["MOD-WIFI-V1", "First gen WiFi", "Modules", "SIN-01", "650", "$9,750", "0.2x", "1,483", "Scrap - Superseded"],
        ]}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Main Modal
// ═══════════════════════════════════════════════════════════
const previewComponents: Record<string, () => JSX.Element> = {
  "rt-11": ShortageRiskPreview,
  "rt-12": SupplierScorecardPreview,
  "rt-13": SpendCommodityPreview,
  "rt-14": POAgingPreview,
  "rt-15": InventoryTurnoverPreview,
};

const reportSubtitles: Record<string, string> = {
  "rt-11": "Generated: 2026-02-25 · EMS Procurement Division",
  "rt-12": "Evaluation Period: Q4 2025 · Generated: 2026-02-25",
  "rt-13": "Fiscal Year 2025 · Generated: 2026-02-25",
  "rt-14": "As of: 2026-02-25 · Report Date: 2026-02-25",
  "rt-15": "Fiscal Year 2025 · Generated: 2026-02-25",
};

export default function ReportPreviewModal({ template, open, onOpenChange, onUseTemplate }: Props) {
  if (!template) return null;

  const PreviewComponent = previewComponents[template.id];
  if (!PreviewComponent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
        {/* Executive Header */}
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                {template.title}
              </DialogTitle>
              <DialogDescription className="mt-0.5">{template.subtitle}</DialogDescription>
              <p className="text-[11px] text-muted-foreground mt-1">{reportSubtitles[template.id]}</p>
            </div>
            <Badge variant="outline" className="text-[10px] shrink-0">Preview</Badge>
          </div>
        </DialogHeader>

        <Separator className="my-1" />

        {/* Report Body */}
        <PreviewComponent />

        <Separator className="my-2" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            Sample data shown. Upload your data to generate a full report.
          </p>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
              onOpenChange(false);
              if (onUseTemplate) onUseTemplate(template);
            }}
          >
            <ArrowRight className="h-3.5 w-3.5" />
            Use this template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
