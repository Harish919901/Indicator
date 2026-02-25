import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Upload, FileSpreadsheet, BarChart3, PieChart as PieIcon, Sparkles,
  CheckCircle2, ArrowRight, ArrowLeft, Lock, Brain, Wand2, RefreshCw,
  ExternalLink, TrendingUp, AlertTriangle, DollarSign,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { toast } from "sonner";

// ── Mock Data (inline) ──────────────────────────────────────────────

const mockParsedData = [
  { MPN: "RC0402FR-07", Supplier: "Yageo", Commodity: "Passives", Cost: 1200, Qty: 100000, UnitCost: 0.012 },
  { MPN: "STM32F407", Supplier: "Arrow", Commodity: "ICs", Cost: 8450, Qty: 1000, UnitCost: 8.45 },
  { MPN: "TPS54302", Supplier: "Digi-Key", Commodity: "Power", Cost: 525, Qty: 250, UnitCost: 2.10 },
  { MPN: "GRM155R71", Supplier: "Murata", Commodity: "Passives", Cost: 800, Qty: 100000, UnitCost: 0.008 },
  { MPN: "744771133", Supplier: "Würth", Commodity: "Passives", Cost: 425, Qty: 500, UnitCost: 0.85 },
  { MPN: "ESP32-WROOM", Supplier: "Mouser", Commodity: "ICs", Cost: 3200, Qty: 400, UnitCost: 8.00 },
  { MPN: "LM7805CT", Supplier: "Arrow", Commodity: "Power", Cost: 180, Qty: 600, UnitCost: 0.30 },
  { MPN: "BAT54S", Supplier: "Digi-Key", Commodity: "Discretes", Cost: 95, Qty: 5000, UnitCost: 0.019 },
];

const rawHeaders = ["mpn_number", "supplier_name", "commodity_cat", "total_cost", "quantity", "unit_price"];
const columnMappingOptions = ["MPN", "Supplier Name", "Commodity Category", "Spend Amount", "Qty", "Unit Cost"];

const cleaningLog = [
  { raw: "rc0402fr07", corrected: "RC0402FR-07", type: "MPN Format", field: "MPN" },
  { raw: "grm155r71", corrected: "GRM155R71", type: "MPN Format", field: "MPN" },
  { raw: "stm32f407", corrected: "STM32F407", type: "MPN Format", field: "MPN" },
  { raw: "YAGEO Corp.", corrected: "Yageo", type: "Supplier Normalize", field: "Supplier" },
  { raw: "DigiKey", corrected: "Digi-Key", type: "Supplier Normalize", field: "Supplier" },
  { raw: "", corrected: "Passives", type: "Blank Fill", field: "Commodity" },
  { raw: "RC0402FR-07", corrected: "(removed duplicate)", type: "Duplicate", field: "Row" },
  { raw: "$8,450.00", corrected: "8450", type: "Currency Strip", field: "Cost" },
  { raw: "N/A", corrected: "0.012", type: "Blank Fill", field: "Unit Cost" },
  { raw: "esp32 wroom", corrected: "ESP32-WROOM", type: "MPN Format", field: "MPN" },
  { raw: "744771133 ", corrected: "744771133", type: "Whitespace Trim", field: "MPN" },
  { raw: "wurth", corrected: "Würth", type: "Supplier Normalize", field: "Supplier" },
  { raw: "bat54s", corrected: "BAT54S", type: "MPN Format", field: "MPN" },
  { raw: "lm7805ct", corrected: "LM7805CT", type: "MPN Format", field: "MPN" },
];

const llmModels = [
  { id: "claude", name: "Claude 3.5 Sonnet", description: "Best for detailed reasoning, anomaly detection & spend analysis", recommended: true },
  { id: "gpt4o", name: "GPT-4o", description: "High-speed summaries, ideal for large datasets", recommended: false },
  { id: "local", name: "Local LLM", description: "Offline/private analysis — no data leaves your network", recommended: false },
];

const analysisInsights = [
  { type: "warning", title: "Pricing Anomaly Detected", detail: "STM32F407 unit cost ($8.45) is 23% above market average ($6.87). Consider alternate sourcing from LCSC or TME.", icon: AlertTriangle },
  { type: "critical", title: "Supplier Concentration Risk", detail: "67% of IC spend flows through Arrow Electronics. Recommend qualifying Mouser or Farnell as secondary source.", icon: AlertTriangle },
  { type: "info", title: "Spend Optimization Opportunity", detail: "Passives category accounts for 21% of spend but 95% of component volume. Negotiate volume discount with Yageo/Murata.", icon: DollarSign },
  { type: "info", title: "Currency Exposure", detail: "100% of spend denominated in USD. Consider hedging if sourcing from EUR/JPY suppliers.", icon: TrendingUp },
];

const pieData = [
  { name: "Passives", value: 2425 },
  { name: "ICs", value: 11650 },
  { name: "Power", value: 705 },
  { name: "Discretes", value: 95 },
];

const spendTrendData = [
  { month: "Jan", spend: 12400 },
  { month: "Feb", spend: 11800 },
  { month: "Mar", spend: 14875 },
  { month: "Apr", spend: 13200 },
  { month: "May", spend: 15600 },
  { month: "Jun", spend: 14875 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

// ── Steps definition ────────────────────────────────────────────────

const steps = [
  { label: "Intake", icon: Upload },
  { label: "Transform", icon: Wand2 },
  { label: "Analyze", icon: Brain },
  { label: "Visualize", icon: BarChart3 },
];

// ── Component ───────────────────────────────────────────────────────

export default function ExcelDashboard() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [stepsCompleted, setStepsCompleted] = useState({ 0: false, 1: false, 2: false, 3: false });
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [purpose, setPurpose] = useState("deep-analysis");
  const [selectedLLM, setSelectedLLM] = useState("claude");
  const [analysisRun, setAnalysisRun] = useState(false);

  const canGoTo = (step: number) => {
    if (step === 0) return true;
    return stepsCompleted[(step - 1) as keyof typeof stepsCompleted];
  };

  const confirmStep = (step: number) => {
    setStepsCompleted((prev) => ({ ...prev, [step]: true }));
    if (step < 3) setActiveStep(step + 1);
  };

  const allHeadersMapped = rawHeaders.every((h) => columnMap[h] && columnMap[h] !== "");

  // ── Stepper Bar ─────────────────────────────────────────────────

  const Stepper = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((s, i) => {
        const completed = stepsCompleted[i as keyof typeof stepsCompleted];
        const active = activeStep === i;
        const locked = !canGoTo(i);
        const Icon = s.icon;
        return (
          <div key={i} className="flex items-center flex-1">
            <button
              onClick={() => canGoTo(i) && setActiveStep(i)}
              disabled={locked}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-teal/10 text-teal font-bold"
                  : completed
                  ? "bg-indigo/10 text-indigo font-semibold"
                  : locked
                  ? "text-muted-foreground opacity-50 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  active
                    ? "bg-teal text-teal-foreground"
                    : completed
                    ? "bg-indigo text-indigo-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {completed ? <CheckCircle2 className="h-4 w-4" /> : locked ? <Lock className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className="hidden sm:inline text-sm">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded ${completed ? "bg-indigo" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  // ── Step 1: Data Intake ─────────────────────────────────────────

  const StepIntake = () => (
    <div className="space-y-6">
      {!uploaded ? (
        <Card className="border-dashed border-2 border-primary/30 gradient-card-warm card-premium">
          <CardContent className="py-20 flex flex-col items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-foreground">Drop your Excel or CSV file here</p>
              <p className="text-sm font-semibold text-muted-foreground mt-1">Supports .xlsx, .xls, .csv up to 50MB</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setUploaded(true)} className="gap-2 btn-glow px-6 h-11 text-sm font-bold">
                <FileSpreadsheet className="h-4 w-4" /> Upload Sample Data
              </Button>
              <Button variant="outline" onClick={() => navigate("/excel-quote")} className="gap-2 h-11 text-sm font-semibold">
                <ExternalLink className="h-4 w-4" /> Skip to Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* File Metadata */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="gap-1.5 px-3 py-1">
              <FileSpreadsheet className="h-3.5 w-3.5" /> sample_bom_data.xlsx
            </Badge>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-bold">
              8 rows × 6 columns
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => { setUploaded(false); setStepsCompleted((p) => ({ ...p, 0: false })); }} className="font-semibold">
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/excel-quote")} className="ml-auto gap-1.5 font-semibold">
              <ExternalLink className="h-3.5 w-3.5" /> Skip to Quote
            </Button>
          </div>

          {/* Column Mapping */}
          <Card className="card-premium border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-indigo flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" /> Column Mapping
              </CardTitle>
              <CardDescription className="font-semibold">
                Map each uploaded column to a system field to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-indigo/5 hover:bg-indigo/5">
                      <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">Uploaded Header</TableHead>
                      <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">→</TableHead>
                      <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">System Field</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawHeaders.map((h) => (
                      <TableRow key={h}>
                        <TableCell className="font-mono text-sm font-semibold">{h}</TableCell>
                        <TableCell className="text-muted-foreground">→</TableCell>
                        <TableCell>
                          <Select value={columnMap[h] || ""} onValueChange={(v) => setColumnMap((p) => ({ ...p, [h]: v }))}>
                            <SelectTrigger className="w-48 h-9">
                              <SelectValue placeholder="Select field…" />
                            </SelectTrigger>
                            <SelectContent>
                              {columnMappingOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  disabled={!allHeadersMapped}
                  onClick={() => { confirmStep(0); toast.success("Column mapping confirmed — cleansing started."); }}
                  className="gap-2 font-bold"
                >
                  Confirm Mapping <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Preview */}
          <Card className="card-premium border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-indigo flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Data Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-indigo/5 hover:bg-indigo/5">
                      {Object.keys(mockParsedData[0]).map((k) => (
                        <TableHead key={k} className="font-bold text-indigo text-xs uppercase tracking-wider">{k}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockParsedData.map((row, i) => (
                      <TableRow key={i}>
                        {Object.values(row).map((v, j) => (
                          <TableCell key={j} className={typeof v === "number" ? "font-bold tabular-nums" : "font-medium"}>
                            {typeof v === "number" ? v.toLocaleString() : v}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  // ── Step 2: Smart Transformation ────────────────────────────────

  const StepTransform = () => (
    <div className="space-y-6">
      {/* Cleansing Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "MPN Formats Standardized", value: "14", gradient: "gradient-card-teal" },
          { label: "Duplicates Removed", value: "3", gradient: "gradient-card-rose" },
          { label: "Blank Fields Filled", value: "2", gradient: "gradient-card-amber" },
          { label: "Suppliers Normalized", value: "4", gradient: "gradient-card-indigo" },
        ].map((s) => (
          <Card key={s.label} className={`card-premium border-0 ${s.gradient}`}>
            <CardContent className="p-5 text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className="text-3xl font-extrabold mt-1.5 text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cleaning Log */}
      <Card className="card-premium border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-indigo flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" /> Data Cleaning Log
          </CardTitle>
          <CardDescription className="font-semibold">{cleaningLog.length} corrections applied automatically</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border max-h-72 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-indigo/5 hover:bg-indigo/5">
                  <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">Field</TableHead>
                  <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">Raw Value</TableHead>
                  <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">→</TableHead>
                  <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">Corrected</TableHead>
                  <TableHead className="font-bold text-indigo text-xs uppercase tracking-wider">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cleaningLog.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold">{entry.field}</TableCell>
                    <TableCell className="font-mono text-sm text-destructive line-through">{entry.raw || "(blank)"}</TableCell>
                    <TableCell className="text-muted-foreground">→</TableCell>
                    <TableCell className="font-mono text-sm text-primary font-bold">{entry.corrected}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-bold">{entry.type}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Before/After Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="card-premium border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-destructive/80">Before (Raw)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded border text-xs font-mono space-y-1 p-3 bg-destructive/5 max-h-40 overflow-y-auto">
              {["rc0402fr07, YAGEO Corp., Passives, $1,200, 100000, N/A",
                "stm32f407, Arrow, ICs, $8,450.00, 1000, 8.45",
                "grm155r71, Murata, , $800, 100000, 0.008",
                "esp32 wroom, Mouser, ICs, 3200, 400, 8.00",
                "bat54s, DigiKey, Discretes, 95, 5000, 0.019",
              ].map((line, i) => (
                <p key={i} className="text-destructive/70">{line}</p>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-primary">After (Standardized)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded border text-xs font-mono space-y-1 p-3 bg-primary/5 max-h-40 overflow-y-auto">
              {["RC0402FR-07, Yageo, Passives, 1200, 100000, 0.012",
                "STM32F407, Arrow, ICs, 8450, 1000, 8.45",
                "GRM155R71, Murata, Passives, 800, 100000, 0.008",
                "ESP32-WROOM, Mouser, ICs, 3200, 400, 8.00",
                "BAT54S, Digi-Key, Discretes, 95, 5000, 0.019",
              ].map((line, i) => (
                <p key={i} className="text-primary">{line}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveStep(0)} className="gap-2 font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={() => { confirmStep(1); toast.success("Data cleansing approved — ready for analysis."); }} className="gap-2 font-bold">
          Approve Cleansing <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // ── Step 3: Intelligence & LLM Reasoning ────────────────────────

  const StepAnalyze = () => (
    <div className="space-y-6">
      {/* Purpose Selector */}
      <Card className="card-premium border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-indigo flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" /> Purpose of This Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={purpose} onValueChange={setPurpose} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "deep-analysis", label: "Deep Analysis" },
              { value: "analytics", label: "Create Analytics/Reports" },
              { value: "rfq", label: "Generate RFQ" },
              { value: "sales-quote", label: "Sales Quote" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2.5 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                  purpose === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}
              >
                <RadioGroupItem value={opt.value} />
                <span className="text-sm font-semibold">{opt.label}</span>
              </label>
            ))}
          </RadioGroup>

          {(purpose === "sales-quote" || purpose === "rfq") && (
            <div className="mt-4 p-3.5 rounded-lg bg-amber/10 border border-amber/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber" />
                <span className="text-sm font-semibold">We recommend switching to the BOM to Quote agent for {purpose === "rfq" ? "RFQ generation" : "sales quoting"}.</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate("/excel-quote")} className="gap-1.5 font-bold">
                Switch <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* LLM Switcher */}
      <Card className="card-premium border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-indigo flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Analysis Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedLLM} onValueChange={setSelectedLLM} className="space-y-3">
            {llmModels.map((m) => (
              <label
                key={m.id}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedLLM === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}
              >
                <RadioGroupItem value={m.id} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{m.name}</span>
                    {m.recommended && <Badge className="text-[10px] py-0 px-1.5 font-bold">Recommended</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold mt-0.5">{m.description}</p>
                </div>
              </label>
            ))}
          </RadioGroup>

          {!analysisRun && (
            <Button
              className="mt-4 gap-2 font-bold w-full"
              onClick={() => { setAnalysisRun(true); toast.success("Analysis complete — insights generated."); }}
            >
              <Brain className="h-4 w-4" /> Run Analysis
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Analysis Output */}
      {analysisRun && (
        <Card className="card-premium border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-indigo flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI-Generated Insights
            </CardTitle>
            <CardDescription className="font-semibold">
              Analyzed with {llmModels.find((m) => m.id === selectedLLM)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysisInsights.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-lg border flex items-start gap-3 ${
                    insight.type === "critical"
                      ? "bg-destructive/5 border-destructive/20"
                      : insight.type === "warning"
                      ? "bg-amber/5 border-amber/20"
                      : "bg-primary/5 border-primary/20"
                  }`}
                >
                  <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${
                    insight.type === "critical" ? "text-destructive" : insight.type === "warning" ? "text-amber" : "text-primary"
                  }`} />
                  <div>
                    <p className="text-sm font-bold">{insight.title}</p>
                    <p className="text-xs text-muted-foreground font-semibold mt-0.5">{insight.detail}</p>
                  </div>
                  <Badge variant="outline" className={`ml-auto text-[10px] font-bold shrink-0 ${
                    insight.type === "critical" ? "border-destructive/30 text-destructive" : insight.type === "warning" ? "border-amber/30 text-amber" : "border-primary/30 text-primary"
                  }`}>
                    {insight.type}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveStep(1)} className="gap-2 font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          disabled={!analysisRun}
          onClick={() => { confirmStep(2); toast.success("Analysis confirmed — visualizations ready."); }}
          className="gap-2 font-bold"
        >
          Continue to Visualize <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // ── Step 4: Executive Visualization ─────────────────────────────

  const StepVisualize = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Spend", value: `$${mockParsedData.reduce((a, r) => a + r.Cost, 0).toLocaleString()}`, gradient: "gradient-card-warm" },
          { label: "Unique Suppliers", value: new Set(mockParsedData.map((r) => r.Supplier)).size, gradient: "gradient-card-indigo" },
          { label: "Components", value: mockParsedData.length, gradient: "gradient-card-teal" },
          { label: "Top Commodity", value: "ICs", gradient: "gradient-card-amber" },
        ].map((k) => (
          <Card key={k.label} className={`card-premium border-0 ${k.gradient}`}>
            <CardContent className="p-5 text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{k.label}</p>
              <p className="text-2xl font-extrabold mt-1.5 text-foreground tracking-tight">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="card-premium border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo">
              <BarChart3 className="h-4 w-4 text-primary" /> Cost by MPN
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockParsedData} barCategoryGap="20%">
                <defs>
                  <linearGradient id="excelBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(153, 99%, 38%)" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(153, 99%, 25%)" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 90%)" vertical={false} />
                <XAxis dataKey="MPN" fontSize={10} stroke="hsl(210, 7%, 56%)" tickLine={false} axisLine={false} />
                <YAxis fontSize={11} stroke="hsl(210, 7%, 56%)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)" }} />
                <Bar dataKey="Cost" fill="url(#excelBarGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-premium border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo">
              <PieIcon className="h-4 w-4 text-primary" /> Spend by Commodity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" nameKey="name" label strokeWidth={2} stroke="hsl(0, 0%, 100%)">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="card-premium border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo">
              <TrendingUp className="h-4 w-4 text-primary" /> Spend Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={spendTrendData}>
                <defs>
                  <linearGradient id="spendLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(232, 48%, 48%)" />
                    <stop offset="100%" stopColor="hsl(153, 99%, 31%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 90%)" vertical={false} />
                <XAxis dataKey="month" fontSize={11} stroke="hsl(210, 7%, 56%)" tickLine={false} axisLine={false} />
                <YAxis fontSize={11} stroke="hsl(210, 7%, 56%)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)" }} />
                <Line type="monotone" dataKey="spend" stroke="url(#spendLineGrad)" strokeWidth={3} dot={{ fill: "hsl(232, 48%, 48%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-premium border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo">
              <DollarSign className="h-4 w-4 text-primary" /> Currency Exposure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-4">
              {[
                { currency: "USD", pct: 78, color: "bg-primary" },
                { currency: "EUR", pct: 12, color: "bg-indigo" },
                { currency: "JPY", pct: 7, color: "bg-amber" },
                { currency: "INR", pct: 3, color: "bg-rose" },
              ].map((c) => (
                <div key={c.currency} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">{c.currency}</span>
                    <span className="font-semibold text-muted-foreground">{c.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${c.color} transition-all duration-500`} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveStep(2)} className="gap-2 font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={() => navigate("/excel-quote")} className="gap-2 font-bold btn-glow">
          <ExternalLink className="h-4 w-4" /> Switch to BOM Agent
        </Button>
      </div>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-indigo">Excel to Dashboard</h1>
        <p className="text-sm font-semibold text-muted-foreground">Upload spreadsheets, cleanse data, run AI analysis, and generate executive visualizations.</p>
      </div>

      <Stepper />

      {activeStep === 0 && <StepIntake />}
      {activeStep === 1 && <StepTransform />}
      {activeStep === 2 && <StepAnalyze />}
      {activeStep === 3 && <StepVisualize />}
    </div>
  );
}
