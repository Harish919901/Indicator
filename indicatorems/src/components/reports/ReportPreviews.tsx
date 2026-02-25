import { DollarSign, Users, TrendingUp, Package, Clock, CheckCircle, AlertTriangle, BarChart3, Layers, ShieldCheck, Building, FileText } from "lucide-react";
import { KpiCard, MiniTable, AlertItem } from "./ReportPreviewHelpers";
import { spendByCommodity } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = [
  "hsl(177, 55%, 39%)",
  "hsl(232, 48%, 48%)",
  "hsl(45, 100%, 50%)",
  "hsl(353, 33%, 58%)",
  "hsl(210, 7%, 46%)",
];

// ── Datasets ──

const bomBreakdownData = [
  { name: "ICs", value: 42 },
  { name: "Passives", value: 28 },
  { name: "Connectors", value: 15 },
  { name: "PCBs", value: 10 },
  { name: "Power", value: 5 },
];

const supplierScorecardData = [
  { name: "Mouser", otd: 96, quality: 99.2, leadTime: 12, rating: "A" },
  { name: "Digi-Key", otd: 98, quality: 99.5, leadTime: 8, rating: "A+" },
  { name: "Arrow", otd: 91, quality: 98.8, leadTime: 18, rating: "B+" },
  { name: "Würth", otd: 88, quality: 99.0, leadTime: 22, rating: "B" },
];

const leadTimeData = [
  { name: "TUSB320", desc: "USB Type-C Controller", supplier: "TI", days: 180, risk: "Critical" },
  { name: "STM32F4", desc: "ARM Cortex-M4 MCU", supplier: "STMicro", days: 156, risk: "High" },
  { name: "LM358", desc: "Dual Op-Amp", supplier: "TI", days: 132, risk: "Medium" },
  { name: "SN74LVC", desc: "Logic Gate IC", supplier: "Nexperia", days: 125, risk: "Medium" },
];

const inventoryData = [
  { name: "Passives", units: 520000, value: 1240000, turnover: 4.2 },
  { name: "ICs", units: 48400, value: 3860000, turnover: 2.8 },
  { name: "Power", units: 20500, value: 890000, turnover: 3.1 },
  { name: "Connectors", units: 12000, value: 420000, turnover: 5.6 },
];

const grnData = [
  { name: "Jan", received: 45, pending: 12 },
  { name: "Feb", received: 52, pending: 8 },
  { name: "Mar", received: 61, pending: 15 },
  { name: "Apr", received: 48, pending: 6 },
];

const qualityData = [
  { name: "Line A", yield: 99.2, defect: 0.8, status: "Pass" },
  { name: "Line B", yield: 98.7, defect: 1.3, status: "Pass" },
  { name: "Line C", yield: 99.5, defect: 0.5, status: "Pass" },
  { name: "Line D", yield: 97.8, defect: 2.2, status: "Watch" },
];

const agingCustomerData = [
  { name: "0-30d", count: 145, amount: 2450000, pct: 45 },
  { name: "31-60d", count: 82, amount: 1520000, pct: 28 },
  { name: "61-90d", count: 38, amount: 815000, pct: 15 },
  { name: "90+d", count: 21, amount: 640000, pct: 12 },
];

const agingSupplierData = [
  { name: "0-30d", count: 98, amount: 1850000 },
  { name: "31-60d", count: 45, amount: 920000 },
  { name: "61-90d", count: 22, amount: 480000 },
  { name: "90+d", count: 11, amount: 310000 },
];

const salesData = [
  { name: "EMEA", revenue: 7840000, orders: 312, avg: 25128 },
  { name: "Americas", revenue: 5070000, orders: 198, avg: 25606 },
  { name: "APAC", revenue: 1870000, orders: 87, avg: 21494 },
];

const orgData = [
  { name: "Engineering", budget: 4200, actual: 3850, variance: 350 },
  { name: "Production", budget: 8700, actual: 9100, variance: -400 },
  { name: "Procurement", budget: 3100, actual: 2950, variance: 150 },
  { name: "Quality", budget: 1500, actual: 1480, variance: 20 },
];

const iqcData = [
  { name: "Line 1", passRate: 98.5, lots: 245, defects: 12 },
  { name: "Line 2", passRate: 99.1, lots: 198, defects: 6 },
  { name: "Line 3", passRate: 97.2, lots: 312, defects: 28 },
  { name: "Line 4", passRate: 99.4, lots: 176, defects: 4 },
];

// ── Previews ──

function SpendAnalysisPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<DollarSign className="h-4 w-4" />} value="$142.5M" label="Total Spend" />
        <KpiCard icon={<Users className="h-4 w-4" />} value="1,420" label="Suppliers" />
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} value="73%" label="Direct Spend" />
      </div>
      <MiniTable
        headers={["Spend Type", "Amount", "% of Total"]}
        rows={[
          ["Direct Materials", "$104.0M", "73%"],
          ["Mfg Opex", "$24.2M", "17%"],
          ["Indirect", "$14.3M", "10%"],
        ]}
      />
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie data={spendByCommodity} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" nameKey="name">
            {spendByCommodity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase">AI Insights</p>
        <AlertItem color="hsl(45, 100%, 50%)" title="Maverick Spend Detected" description="$3.2M in off-contract purchases across 14 suppliers" />
        <AlertItem color="hsl(177, 55%, 39%)" title="Consolidation Opportunity" description="5 suppliers for same commodity — potential 12% savings" />
      </div>
    </div>
  );
}

function BomBreakdownPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<DollarSign className="h-4 w-4" />} value="$8.4M" label="Total BOM Cost" />
        <KpiCard icon={<Package className="h-4 w-4" />} value="3,842" label="Unique MPNs" />
        <KpiCard icon={<Clock className="h-4 w-4" />} value="28 days" label="Avg Lead Time" />
      </div>
      <MiniTable
        headers={["Component", "Cost", "% of BOM"]}
        rows={[
          ["ICs / Semiconductors", "$3.53M", "42%"],
          ["Passive Components", "$2.35M", "28%"],
          ["Connectors", "$1.26M", "15%"],
          ["PCBs / Substrates", "$0.84M", "10%"],
        ]}
      />
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={bomBreakdownData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" horizontal={false} />
          <XAxis type="number" fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <YAxis dataKey="name" type="category" fontSize={10} stroke="hsl(210, 7%, 46%)" width={65} />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Bar dataKey="value" fill="hsl(177, 55%, 39%)" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function SupplierScorecardPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<CheckCircle className="h-4 w-4" />} value="93.3%" label="Avg OTD" />
        <KpiCard icon={<ShieldCheck className="h-4 w-4" />} value="99.1%" label="Avg Quality" />
        <KpiCard icon={<Users className="h-4 w-4" />} value="4" label="Evaluated" />
      </div>
      <MiniTable
        headers={["Supplier", "OTD%", "Quality%", "Lead Time", "Rating"]}
        rows={supplierScorecardData.map(s => [s.name, `${s.otd}%`, `${s.quality}%`, `${s.leadTime}d`, s.rating])}
      />
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={supplierScorecardData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
          <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <YAxis fontSize={10} stroke="hsl(210, 7%, 46%)" domain={[80, 100]} />
          <Tooltip />
          <Bar dataKey="otd" fill="hsl(177, 55%, 39%)" radius={[3, 3, 0, 0]} name="OTD %" />
          <Bar dataKey="quality" fill="hsl(353, 33%, 58%)" radius={[3, 3, 0, 0]} name="Quality %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LeadTimePreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<AlertTriangle className="h-4 w-4" />} value="4" label="Parts >120d" />
        <KpiCard icon={<Clock className="h-4 w-4" />} value="180 days" label="Longest Lead" />
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} value="28 days" label="Avg Excess" />
      </div>
      <MiniTable
        headers={["MPN", "Supplier", "Lead Time", "Risk"]}
        rows={leadTimeData.map(d => [d.name, d.supplier, `${d.days}d`, d.risk])}
      />
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={leadTimeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
          <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <YAxis fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <Tooltip formatter={(v: number) => `${v} days`} />
          <Bar dataKey="days" fill="hsl(45, 100%, 50%)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function InventoryPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<Package className="h-4 w-4" />} value="600.9K" label="Total Units" />
        <KpiCard icon={<DollarSign className="h-4 w-4" />} value="$6.4M" label="Total Value" />
        <KpiCard icon={<AlertTriangle className="h-4 w-4" />} value="3" label="Low Stock" />
      </div>
      <MiniTable
        headers={["Commodity", "Units", "Value", "Turnover"]}
        rows={inventoryData.map(d => [d.name, d.units.toLocaleString(), `$${(d.value / 1e6).toFixed(1)}M`, `${d.turnover}x`])}
      />
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={inventoryData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
          <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <YAxis fontSize={10} stroke="hsl(210, 7%, 46%)" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
          <Bar dataKey="value" fill="hsl(232, 48%, 48%)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function GrnPosPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<FileText className="h-4 w-4" />} value="247" label="Total POs" />
        <KpiCard icon={<CheckCircle className="h-4 w-4" />} value="206" label="Received" />
        <KpiCard icon={<Clock className="h-4 w-4" />} value="41" label="Pending" />
      </div>
      <MiniTable
        headers={["Month", "Received", "Pending", "Variance"]}
        rows={grnData.map(d => [d.name, d.received, d.pending, `${d.received - d.pending > 0 ? "+" : ""}${d.received - d.pending}`])}
      />
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={grnData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
          <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <YAxis fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <Tooltip />
          <Bar dataKey="received" stackId="a" fill="hsl(177, 55%, 39%)" name="Received" />
          <Bar dataKey="pending" stackId="a" fill="hsl(45, 100%, 50%)" radius={[3, 3, 0, 0]} name="Pending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function QualityYieldPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<CheckCircle className="h-4 w-4" />} value="98.8%" label="Avg Yield" />
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} value="Line C" label="Best Line" />
        <KpiCard icon={<AlertTriangle className="h-4 w-4" />} value="1" label="Below Target" />
      </div>
      <MiniTable
        headers={["Line", "Yield%", "Defect%", "Status"]}
        rows={qualityData.map(d => [d.name, `${d.yield}%`, `${d.defect}%`, d.status])}
      />
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={qualityData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
          <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <YAxis fontSize={10} stroke="hsl(210, 7%, 46%)" domain={[96, 100]} />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Bar dataKey="yield" fill="hsl(177, 55%, 39%)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function AgingCustomerPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<DollarSign className="h-4 w-4" />} value="$5.4M" label="Total Outstanding" />
        <KpiCard icon={<AlertTriangle className="h-4 w-4" />} value="$640K" label=">90d Amount" />
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} value="88%" label="Collection Rate" />
      </div>
      <MiniTable
        headers={["Bucket", "Count", "Amount", "% Total"]}
        rows={agingCustomerData.map(d => [d.name, d.count, `$${(d.amount / 1e6).toFixed(1)}M`, `${d.pct}%`])}
      />
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={agingCustomerData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
          <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <YAxis fontSize={10} stroke="hsl(210, 7%, 46%)" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
          <Bar dataKey="amount" fill="hsl(353, 33%, 58%)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function AgingSupplierPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<DollarSign className="h-4 w-4" />} value="$3.6M" label="Total Payables" />
        <KpiCard icon={<AlertTriangle className="h-4 w-4" />} value="$310K" label="Overdue" />
        <KpiCard icon={<CheckCircle className="h-4 w-4" />} value="94%" label="On-Time Pay %" />
      </div>
      <MiniTable
        headers={["Bucket", "Count", "Amount"]}
        rows={agingSupplierData.map(d => [d.name, d.count, `$${(d.amount / 1e6).toFixed(1)}M`])}
      />
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={agingSupplierData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
          <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <YAxis fontSize={10} stroke="hsl(210, 7%, 46%)" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
          <Bar dataKey="amount" fill="hsl(232, 48%, 48%)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomerSalesPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<DollarSign className="h-4 w-4" />} value="$14.8M" label="Total Revenue" />
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} value="EMEA" label="Top Region" />
        <KpiCard icon={<Users className="h-4 w-4" />} value="597" label="Active Customers" />
      </div>
      <MiniTable
        headers={["Region", "Revenue", "Orders", "Avg Order"]}
        rows={salesData.map(d => [d.name, `$${(d.revenue / 1e6).toFixed(1)}M`, d.orders, `$${(d.avg / 1000).toFixed(1)}K`])}
      />
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
          <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <YAxis fontSize={10} stroke="hsl(210, 7%, 46%)" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
          <Tooltip formatter={(v: number) => `$${(v / 1e6).toFixed(1)}M`} />
          <Bar dataKey="revenue" fill="hsl(232, 48%, 48%)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function OrgDrilldownPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<Building className="h-4 w-4" />} value="4" label="Departments" />
        <KpiCard icon={<DollarSign className="h-4 w-4" />} value="$17.5M" label="Total Spend" />
        <KpiCard icon={<Layers className="h-4 w-4" />} value="Production" label="Largest Dept" />
      </div>
      <MiniTable
        headers={["Department", "Budget ($K)", "Actual ($K)", "Variance"]}
        rows={orgData.map(d => [d.name, `$${d.budget}`, `$${d.actual}`, `${d.variance > 0 ? "+" : ""}$${d.variance}`])}
      />
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={orgData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" horizontal={false} />
          <XAxis type="number" fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <YAxis dataKey="name" type="category" fontSize={10} stroke="hsl(210, 7%, 46%)" width={75} />
          <Tooltip />
          <Bar dataKey="budget" fill="hsl(177, 55%, 39%)" radius={[0, 3, 3, 0]} name="Budget" />
          <Bar dataKey="actual" fill="hsl(353, 33%, 58%)" radius={[0, 3, 3, 0]} name="Actual" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function IqcReportPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard icon={<BarChart3 className="h-4 w-4" />} value="931" label="Total Lots" />
        <KpiCard icon={<CheckCircle className="h-4 w-4" />} value="98.6%" label="Pass Rate" />
        <KpiCard icon={<AlertTriangle className="h-4 w-4" />} value="50" label="Rejections" />
      </div>
      <MiniTable
        headers={["Line", "Pass Rate", "Lots", "Defects"]}
        rows={iqcData.map(d => [d.name, `${d.passRate}%`, d.lots, d.defects])}
      />
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={iqcData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
          <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 46%)" />
          <YAxis fontSize={10} stroke="hsl(210, 7%, 46%)" domain={[96, 100]} />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Bar dataKey="passRate" fill="hsl(45, 100%, 50%)" radius={[3, 3, 0, 0]} name="Pass Rate %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Main export ──

export function getReportPreview(reportId: string) {
  switch (reportId) {
    case "spend-analysis": return <SpendAnalysisPreview />;
    case "bom-breakdown": return <BomBreakdownPreview />;
    case "supplier-scorecard": return <SupplierScorecardPreview />;
    case "lead-time-120": return <LeadTimePreview />;
    case "inventory": return <InventoryPreview />;
    case "grn-pos": return <GrnPosPreview />;
    case "quality-yield": return <QualityYieldPreview />;
    case "aging-customer": return <AgingCustomerPreview />;
    case "aging-supplier": return <AgingSupplierPreview />;
    case "customer-sales": return <CustomerSalesPreview />;
    case "org-drilldown": return <OrgDrilldownPreview />;
    case "iqc-report": return <IqcReportPreview />;
    default: return <p className="text-sm text-muted-foreground text-center py-8">Select a report to preview</p>;
  }
}
