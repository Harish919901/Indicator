import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Plug, RefreshCw, AlertTriangle, CheckCircle2, Clock, Database, Search, Lock,
  Shield, Zap, ArrowRight, ArrowLeft, Settings, Bell, Info, Target, FileText,
  BarChart3, Download, Eye, Brain, Layers, Upload, Play, Loader2, PieChart,
  TrendingUp, AlertCircle, FileSpreadsheet, ExternalLink
} from "lucide-react";
import { sapTables, sapFieldMappings, sapAlertConfig, sapPurchaseOrders, sapAlerts } from "@/data/mockData";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart as RechartsPie, Pie, LineChart, Line, CartesianGrid, Legend } from "recharts";

const STEPS = [
  { num: 1, label: "Identify Problem", icon: Target },
  { num: 2, label: "Data Source", icon: Database },
  { num: 3, label: "Run Analysis", icon: Play },
  { num: 4, label: "View & Export", icon: BarChart3 },
];

const PROBLEM_TYPES = [
  { id: "enhance", label: "Enhance Existing Report", description: "Improve an existing SAP report with AI-driven insights, better visuals, and deeper drill-downs", icon: TrendingUp },
  { id: "create", label: "Create New Report", description: "Build a new analytical report from SAP tables and data sources using AI", icon: FileText },
  { id: "anomalies", label: "Find Anomalies", description: "Detect pricing anomalies, duplicate entries, outliers, and data inconsistencies in existing reports", icon: AlertCircle },
  { id: "standardize", label: "Standardization & Mapping", description: "Normalize SAP field names, map raw codes to business labels, and enforce data standards", icon: Layers },
];

const DEPARTMENTS = [
  { id: "purchasing", label: "Purchasing", color: "text-primary" },
  { id: "production", label: "Production", color: "text-indigo" },
  { id: "quality", label: "Quality", color: "text-teal" },
  { id: "sales", label: "Sales", color: "text-amber" },
  { id: "finance", label: "Finance", color: "text-destructive" },
];

const SAP_REPORTS = [
  { id: "me2m", name: "ME2M — Purchase Orders by Material", table: "EKPO", records: 128450, department: "Purchasing" },
  { id: "mb52", name: "MB52 — Warehouse Stock Overview", table: "MARA", records: 45230, department: "Production" },
  { id: "me2n", name: "ME2N — Purchase Orders by Vendor", table: "EKPO", records: 128450, department: "Purchasing" },
  { id: "cs15", name: "CS15 — BOM Where-Used List", table: "STPO", records: 67890, department: "Production" },
  { id: "qm10", name: "QM10 — Quality Notifications", table: "QALS", records: 12340, department: "Quality" },
  { id: "va05", name: "VA05 — Sales Order List", table: "VBAP", records: 89120, department: "Sales" },
  { id: "fbl1n", name: "FBL1N — Vendor Line Items", table: "EKPO", records: 56780, department: "Finance" },
  { id: "coois", name: "COOIS — Production Order Info", table: "AFKO", records: 34560, department: "Production" },
];

const ANALYSIS_RESULTS = {
  enhance: {
    title: "Report Enhancement Complete",
    insights: [
      { severity: "info", text: "Added 3 new drill-down dimensions: Supplier Region, Commodity Sub-Group, Currency" },
      { severity: "info", text: "Automated trend line overlays for monthly spend — 12-month rolling average applied" },
      { severity: "warning", text: "Suggested adding a supplier concentration risk widget — top 3 suppliers hold 68% of spend" },
      { severity: "info", text: "KPI cards added: Avg PO Value, Lead Time Distribution, On-Time Delivery %" },
    ],
  },
  create: {
    title: "New Report Generated",
    insights: [
      { severity: "info", text: "Created cross-functional report linking EKPO, MARA, and QALS tables" },
      { severity: "info", text: "Generated 4 visualizations: Spend by Commodity, PO Status Distribution, Lead Time Heatmap, Quality Rate Trend" },
      { severity: "warning", text: "3 material groups have no quality inspection data — recommend adding QM linkage" },
      { severity: "info", text: "Report auto-scheduled for daily refresh at 06:00 UTC" },
    ],
  },
  anomalies: {
    title: "Anomaly Detection Complete",
    insights: [
      { severity: "critical", text: "PO 4500000032 — PCB Prototype Service net value ₹116,909 is 23% above standard cost benchmark" },
      { severity: "critical", text: "Duplicate material entries detected: 'Zener Diode 3.3V' appears under 2 different suppliers with 121% price variance" },
      { severity: "warning", text: "Wi-Fi Module 802.11 — quantity 5,000 at $23,610 is 3.2σ above mean PO value for this commodity" },
      { severity: "warning", text: "4 POs have mixed currency (INR + USD) from the same supplier — reconciliation recommended" },
      { severity: "info", text: "Overall data quality score: 87/100 — 13 records flagged for review" },
    ],
  },
  standardize: {
    title: "Standardization & Mapping Complete",
    insights: [
      { severity: "info", text: "12 SAP fields normalized: EKPO.EBELN → 'PO Number', EKPO.NETWR → 'Net Order Value', etc." },
      { severity: "info", text: "Material descriptions standardized — 'MCU ARM Cortex-M4' unified across 3 naming variants" },
      { severity: "warning", text: "2 supplier names need manual review: 'Meridian Technologies' vs 'Meridian Tech Inc.'" },
      { severity: "info", text: "Currency codes mapped to ISO 4217 — INR and USD validated, no unknown currencies" },
    ],
  },
};

const spendBySupplierData = [
  { name: "Pacific Trading", value: 23610 },
  { name: "Atlas Precision", value: 11691 },
  { name: "Meridian Tech", value: 3658 },
  { name: "Pinnacle Mech", value: 1032 },
  { name: "Solaris Cable", value: 5642 },
  { name: "Vertex Elec", value: 72 },
  { name: "Nexus Semi", value: 159 },
];

const poStatusData = [
  { name: "Completed", value: 4, fill: "hsl(var(--primary))" },
  { name: "Partial", value: 3, fill: "hsl(var(--amber))" },
  { name: "Open", value: 1, fill: "hsl(var(--indigo))" },
];

const monthlyPOTrend = [
  { month: "Sep", count: 12, value: 34200 },
  { month: "Oct", count: 18, value: 52100 },
  { month: "Nov", count: 15, value: 41800 },
  { month: "Dec", count: 22, value: 67300 },
  { month: "Jan", count: 28, value: 89400 },
  { month: "Feb", count: 24, value: 71500 },
];

const CHART_COLORS = [
  "hsl(var(--primary))", "hsl(var(--indigo))", "hsl(var(--teal))",
  "hsl(var(--amber))", "hsl(var(--destructive))", "hsl(177, 55%, 39%)", "hsl(232, 48%, 48%)"
];

export default function SapBridge() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [dataSourceType, setDataSourceType] = useState<"report" | "table" | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState({ 1: false, 2: false, 3: false, 4: false });

  const canProceedStep1 = selectedProblem && selectedDepartment;
  const canProceedStep2 = dataSourceType && selectedSources.length > 0;

  const confirmStep = (step: number) => {
    setStepsCompleted(p => ({ ...p, [step]: true }));
    setActiveStep(step + 1);
  };

  const goToStep = (step: number) => {
    if (step === 1 || stepsCompleted[step - 1 as keyof typeof stepsCompleted]) {
      setActiveStep(step);
    }
  };

  const isStepLocked = (step: number) => step > 1 && !stepsCompleted[(step - 1) as keyof typeof stepsCompleted];

  const toggleSource = (id: string) => {
    setSelectedSources(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const runAnalysis = useCallback(() => {
    setAnalysisRunning(true);
    setAnalysisProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setAnalysisRunning(false);
        setAnalysisComplete(true);
        setStepsCompleted(p => ({ ...p, 3: true }));
        toast.success("Analysis complete — results ready in Step 4");
      }
      setAnalysisProgress(Math.min(progress, 100));
    }, 300);
  }, []);

  const filteredReports = SAP_REPORTS.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = !selectedDepartment || r.department.toLowerCase() === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const filteredTables = sapTables.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const analysisResult = selectedProblem ? ANALYSIS_RESULTS[selectedProblem as keyof typeof ANALYSIS_RESULTS] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo">
          <Plug className="h-6 w-6 text-primary" /> AI Bridge for SAP
        </h1>
        <p className="text-sm font-semibold text-muted-foreground">Identify problems, connect SAP data, run AI analysis, and export insights.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between px-4 py-3 bg-card rounded-xl border">
        {STEPS.map((step, i) => {
          const locked = isStepLocked(step.num);
          const isActive = activeStep === step.num;
          const isCompleted = stepsCompleted[step.num as keyof typeof stepsCompleted];
          const Icon = step.icon;
          return (
            <div key={step.num} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => goToStep(step.num)}
                disabled={locked}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  locked ? "opacity-50 cursor-not-allowed text-muted-foreground" :
                  isActive ? "bg-teal/10 text-teal" :
                  isCompleted ? "bg-indigo/10 text-indigo" :
                  "text-muted-foreground hover:bg-muted"
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  locked ? "border-muted-foreground bg-muted" :
                  isActive ? "border-teal bg-teal text-teal-foreground" :
                  isCompleted ? "border-indigo bg-indigo text-indigo-foreground" :
                  "border-muted-foreground"
                }`}>
                  {locked ? <Lock className="h-3.5 w-3.5" /> : isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.num}
                </div>
                <span className="hidden md:inline">{step.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? "bg-indigo" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ═══ Step 1: Identify Problem & Department ═══ */}
      {activeStep === 1 && (
        <div className="space-y-5">
          {/* Problem Type Selection */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-indigo flex items-center gap-2">
                <Target className="h-4 w-4" /> What would you like to do?
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PROBLEM_TYPES.map(pt => {
                const Icon = pt.icon;
                const selected = selectedProblem === pt.id;
                return (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedProblem(pt.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selected
                        ? "border-teal bg-teal/5 shadow-sm"
                        : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${selected ? "bg-teal/10" : "bg-muted"}`}>
                        <Icon className={`h-4.5 w-4.5 ${selected ? "text-teal" : "text-muted-foreground"}`} />
                      </div>
                      <span className="font-semibold text-sm">{pt.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{pt.description}</p>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Department Selection */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-indigo flex items-center gap-2">
                <Layers className="h-4 w-4" /> Select Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map(dept => {
                  const selected = selectedDepartment === dept.id;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDepartment(dept.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        selected
                          ? "border-teal bg-teal/10 text-teal"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {dept.label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Summary & Confirm */}
          {canProceedStep1 && (
            <Card className="shadow-sm border-teal/30 bg-teal/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal" />
                  <div>
                    <p className="text-sm font-medium">
                      {PROBLEM_TYPES.find(p => p.id === selectedProblem)?.label} — {DEPARTMENTS.find(d => d.id === selectedDepartment)?.label}
                    </p>
                    <p className="text-xs text-muted-foreground">Ready to select data source</p>
                  </div>
                </div>
                <Button size="sm" className="gap-1" onClick={() => confirmStep(1)}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ═══ Step 2: Data Source ═══ */}
      {activeStep === 2 && (
        <div className="space-y-5">
          {/* Source Type Toggle */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-indigo flex items-center gap-2">
                <Database className="h-4 w-4" /> Choose Data Source Type
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => { setDataSourceType("report"); setSelectedSources([]); setSearchQuery(""); }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  dataSourceType === "report" ? "border-teal bg-teal/5" : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FileSpreadsheet className={`h-5 w-5 ${dataSourceType === "report" ? "text-teal" : "text-muted-foreground"}`} />
                  <span className="font-semibold text-sm">Import SAP S/4HANA Reports</span>
                </div>
                <p className="text-xs text-muted-foreground">Select from pre-configured SAP standard reports (ME2M, MB52, VA05, etc.)</p>
              </button>
              <button
                onClick={() => { setDataSourceType("table"); setSelectedSources([]); setSearchQuery(""); }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  dataSourceType === "table" ? "border-teal bg-teal/5" : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Database className={`h-5 w-5 ${dataSourceType === "table" ? "text-teal" : "text-muted-foreground"}`} />
                  <span className="font-semibold text-sm">Import SAP Tables Directly</span>
                </div>
                <p className="text-xs text-muted-foreground">Connect to raw SAP tables (MARA, EKPO, STPO, VBAP) for custom analysis</p>
              </button>
            </CardContent>
          </Card>

          {/* Source Selection */}
          {dataSourceType && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base text-indigo">
                  {dataSourceType === "report" ? "Available SAP Reports" : "Available SAP Tables"}
                </CardTitle>
                <Badge variant="outline" className="text-teal border-teal/30">
                  {selectedSources.length} selected
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={dataSourceType === "report" ? "Search reports..." : "Search tables..."}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {dataSourceType === "report" ? (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {filteredReports.map(r => {
                      const selected = selectedSources.includes(r.id);
                      return (
                        <button
                          key={r.id}
                          onClick={() => toggleSource(r.id)}
                          className={`w-full text-left flex items-center justify-between p-3 rounded-lg border transition-all ${
                            selected ? "border-teal bg-teal/5" : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${selected ? "bg-teal/10" : "bg-muted"}`}>
                              <FileText className={`h-4 w-4 ${selected ? "text-teal" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{r.name}</p>
                              <p className="text-xs text-muted-foreground">Table: {r.table} • {r.records.toLocaleString()} records</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{r.department}</Badge>
                            {selected && <CheckCircle2 className="h-4 w-4 text-teal" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTables.map(t => {
                        const selected = selectedSources.includes(t.name);
                        return (
                          <TableRow
                            key={t.name}
                            className={`cursor-pointer ${selected ? "bg-teal/5" : "hover:bg-muted/50"} ${t.status === "stale" ? "bg-amber/5" : ""}`}
                            onClick={() => toggleSource(t.name)}
                          >
                            <TableCell>
                              {selected ? <CheckCircle2 className="h-4 w-4 text-teal" /> : <div className="h-4 w-4 rounded border border-muted-foreground/30" />}
                            </TableCell>
                            <TableCell className="font-mono font-medium">{t.name}</TableCell>
                            <TableCell>{t.description}</TableCell>
                            <TableCell><Badge variant="outline" className="text-xs">{t.category}</Badge></TableCell>
                            <TableCell>{t.records.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={t.status === "synced" ? "outline" : "destructive"}
                                className={t.status === "synced" ? "text-primary border-primary/30" : "bg-amber/10 text-amber border-amber/30"}>
                                {t.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {/* Confirm */}
          {canProceedStep2 && (
            <Card className="shadow-sm border-teal/30 bg-teal/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal" />
                  <div>
                    <p className="text-sm font-medium">{selectedSources.length} source(s) selected</p>
                    <p className="text-xs text-muted-foreground">{selectedSources.join(", ")}</p>
                  </div>
                </div>
                <Button size="sm" className="gap-1" onClick={() => confirmStep(2)}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ═══ Step 3: Run Analysis ═══ */}
      {activeStep === 3 && (
        <div className="space-y-5">
          {/* Analysis Config Summary */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-indigo flex items-center gap-2">
                <Brain className="h-4 w-4" /> Analysis Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Problem Type</p>
                  <p className="text-sm font-medium">{PROBLEM_TYPES.find(p => p.id === selectedProblem)?.label}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Department</p>
                  <p className="text-sm font-medium capitalize">{selectedDepartment}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Data Sources</p>
                  <p className="text-sm font-medium">{selectedSources.length} source(s)</p>
                </div>
              </div>

              {/* Analysis Engine */}
              <div className="p-4 rounded-xl border-2 border-dashed border-teal/30 text-center space-y-4">
                {!analysisRunning && !analysisComplete && (
                  <>
                    <div className="h-16 w-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto">
                      <Brain className="h-8 w-8 text-teal" />
                    </div>
                    <div>
                      <p className="font-semibold">Ready to Run AI Analysis</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        The engine will process {selectedSources.join(", ")} using {PROBLEM_TYPES.find(p => p.id === selectedProblem)?.label.toLowerCase()} logic
                      </p>
                    </div>
                    <Button className="gap-2" onClick={runAnalysis}>
                      <Play className="h-4 w-4" /> Run Analysis
                    </Button>
                  </>
                )}

                {analysisRunning && (
                  <>
                    <Loader2 className="h-10 w-10 text-teal animate-spin mx-auto" />
                    <div>
                      <p className="font-semibold">Analyzing SAP Data...</p>
                      <p className="text-xs text-muted-foreground mt-1">Processing records and applying AI models</p>
                    </div>
                    <Progress value={analysisProgress} className="h-2 max-w-sm mx-auto" />
                    <p className="text-xs text-muted-foreground">{Math.round(analysisProgress)}% complete</p>
                  </>
                )}

                {analysisComplete && (
                  <>
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Analysis Complete</p>
                      <p className="text-xs text-muted-foreground mt-1">Results are ready — proceed to View & Export</p>
                    </div>
                    <Button className="gap-2" onClick={() => setActiveStep(4)}>
                      View Results <ArrowRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Preview (appears during/after analysis) */}
          {(analysisRunning || analysisComplete) && analysisResult && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-indigo">{analysisResult.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysisResult.insights.map((insight, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
                    insight.severity === "critical" ? "border-destructive/30 bg-destructive/5" :
                    insight.severity === "warning" ? "border-amber/30 bg-amber/5" :
                    "border-border"
                  }`}>
                    {insight.severity === "critical" && <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />}
                    {insight.severity === "warning" && <AlertCircle className="h-4 w-4 text-amber shrink-0 mt-0.5" />}
                    {insight.severity === "info" && <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
                    <p className="text-sm">{insight.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ═══ Step 4: View & Export Output ═══ */}
      {activeStep === 4 && (
        <div className="space-y-5">
          {/* Export Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.success("Report exported as PDF")}>
              <Download className="h-3.5 w-3.5" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.success("Data exported as Excel")}>
              <FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.success("Sent to AI Insights for deeper analysis")}>
              <ExternalLink className="h-3.5 w-3.5" /> Send to AI Insights
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.success("Report shared with team")}>
              <Eye className="h-3.5 w-3.5" /> Share Report
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total POs Analyzed", value: "8", icon: FileText, color: "text-primary" },
              { label: "Total Net Value", value: "$162K", icon: TrendingUp, color: "text-teal" },
              { label: "Anomalies Found", value: analysisResult?.insights.filter(i => i.severity === "critical").length || 0, icon: AlertTriangle, color: "text-destructive" },
              { label: "Data Quality", value: "87%", icon: Shield, color: "text-indigo" },
            ].map(kpi => (
              <Card key={kpi.label} className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  <div>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <p className="text-xl font-bold">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Spend by Supplier */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-indigo">Spend by Supplier</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={spendBySupplierData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={90} />
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {spendBySupplierData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* PO Status Distribution */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-indigo">PO Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={220}>
                  <RechartsPie>
                    <Pie data={poStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                      {poStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly PO Trend */}
            <Card className="shadow-sm md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-indigo">Monthly PO Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={monthlyPOTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="count" stroke="hsl(var(--primary))" name="PO Count" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="value" stroke="hsl(var(--teal))" name="Value ($)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Insights Recap */}
          {analysisResult && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-indigo flex items-center gap-2">
                  <Brain className="h-4 w-4" /> AI Analysis Findings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysisResult.insights.map((insight, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
                    insight.severity === "critical" ? "border-destructive/30 bg-destructive/5" :
                    insight.severity === "warning" ? "border-amber/30 bg-amber/5" :
                    "border-border"
                  }`}>
                    {insight.severity === "critical" && <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />}
                    {insight.severity === "warning" && <AlertCircle className="h-4 w-4 text-amber shrink-0 mt-0.5" />}
                    {insight.severity === "info" && <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
                    <p className="text-sm">{insight.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Synced PO Data Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-indigo">Source Data — Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Net Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sapPurchaseOrders.map((po, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">{po.po}</TableCell>
                      <TableCell className="font-mono text-xs">{po.item}</TableCell>
                      <TableCell>{po.supplier}</TableCell>
                      <TableCell>{po.material}</TableCell>
                      <TableCell className="text-right">{po.qty.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">
                        {po.currency === "INR" ? "₹" : "$"}{po.netValue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          po.status === "Completed" ? "text-primary border-primary/30" :
                          po.status === "Partial" ? "text-amber border-amber/30" :
                          "text-indigo border-indigo/30"
                        }>
                          {po.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={() => setActiveStep(s => Math.max(1, s - 1))} disabled={activeStep === 1} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        {activeStep < 4 && (
          <Button
            onClick={() => {
              if (activeStep === 1 && canProceedStep1) confirmStep(1);
              else if (activeStep === 2 && canProceedStep2) confirmStep(2);
              else if (activeStep === 3 && analysisComplete) setActiveStep(4);
            }}
            disabled={
              (activeStep === 1 && !canProceedStep1) ||
              (activeStep === 2 && !canProceedStep2) ||
              (activeStep === 3 && !analysisComplete)
            }
            className="gap-1"
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
