import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp, TrendingDown, Package, Clock, CheckCircle2, AlertTriangle, DollarSign
} from "lucide-react";
import { kpiData, monthlyRevenue, spendByCommodity, departmentSpend, components } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Line, Legend
} from "recharts";

const COLORS = [
  "hsl(177, 55%, 39%)",   // Slate Teal
  "hsl(232, 48%, 48%)",   // Deep Indigo
  "hsl(45, 100%, 50%)",   // Amber Gold
  "hsl(353, 33%, 58%)",   // Dusty Rose
  "hsl(210, 7%, 46%)",    // Cool Gray
];

const kpiGradients = [
  "gradient-card-warm",
  "gradient-card-indigo",
  "gradient-card-amber",
  "gradient-card-teal",
];

const kpiIconBgs = [
  "bg-primary/12",
  "bg-indigo/12",
  "bg-amber/12",
  "bg-primary/12",
];

const kpiIconColors = [
  "text-primary",
  "text-indigo",
  "text-amber",
  "text-primary",
];

export default function Index() {
  const shortages = components.filter((c) => c.leadTime > 100);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-indigo">Welcome back, Rajesh 👋</h1>
        <p className="text-sm font-semibold text-muted-foreground">Here's your manufacturing operations overview.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: "Total Revenue", value: `$${(kpiData.totalRevenue / 1e6).toFixed(1)}M`, icon: DollarSign, trend: "+12.3%", up: true },
          { label: "Active Projects", value: kpiData.activeProjects, icon: Package, trend: "+2", up: true },
          { label: "Open POs", value: kpiData.openPOs, icon: Clock, trend: "-8", up: false },
          { label: "On-Time Delivery", value: `${kpiData.onTimeDelivery}%`, icon: CheckCircle2, trend: "+1.2%", up: true },
        ].map((kpi, idx) => (
          <Card key={kpi.label} className={`card-premium border-0 ${kpiGradients[idx]}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-extrabold mt-1.5 text-foreground tracking-tight">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    {kpi.up ? <TrendingUp className="h-3.5 w-3.5 text-teal" /> : <TrendingDown className="h-3.5 w-3.5 text-amber" />}
                    <span className={`text-xs font-bold ${kpi.up ? "text-teal" : "text-amber"}`}>{kpi.trend}</span>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-xl ${kpiIconBgs[idx]} flex items-center justify-center`}>
                  <kpi.icon className={`h-6 w-6 ${kpiIconColors[idx]}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2 card-premium border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-indigo">Monthly Revenue & Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenue} barCategoryGap="20%">
                <defs>
                  <linearGradient id="barTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(177, 55%, 44%)" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(177, 55%, 34%)" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="lineIndigo" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(232, 48%, 48%)" />
                    <stop offset="100%" stopColor="hsl(232, 48%, 58%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 90%)" vertical={false} />
                <XAxis dataKey="month" fontSize={12} stroke="hsl(210, 7%, 46%)" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" fontSize={12} tickFormatter={(v) => `$${v / 1e6}M`} stroke="hsl(210, 7%, 46%)" tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} stroke="hsl(210, 7%, 46%)" tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value: number, name: string) => [name === "revenue" ? `$${(value / 1e6).toFixed(2)}M` : value, name === "revenue" ? "Revenue" : "Orders"]}
                  contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)" }}
                />
                <Legend wrapperStyle={{ paddingTop: "12px" }} />
                <Bar yAxisId="left" dataKey="revenue" radius={[6, 6, 0, 0]} name="Revenue">
                  {monthlyRevenue.map((_, i) => {
                    const colors = ["#3da29d", "#515fbc", "#ffc721"];
                    return <Cell key={i} fill={colors[i % 3]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spend by Commodity - Donut */}
        <Card className="card-premium border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-indigo">Spend by Commodity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <defs>
                  {COLORS.map((c, i) => (
                    <linearGradient key={i} id={`pieGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={c} stopOpacity={1} />
                      <stop offset="100%" stopColor={c} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={spendByCommodity}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  dataKey="value" nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={11}
                  strokeWidth={2}
                  stroke="hsl(0, 0%, 100%)"
                >
                  {spendByCommodity.map((_, i) => (
                    <Cell key={i} fill={`url(#pieGrad${i})`} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
                  contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {shortages.length > 0 && (
        <Card className="border-amber/40 gradient-card-amber border-0 card-premium">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber/15 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Component Lead Time Alerts</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">
                {shortages.map((c) => c.mpn).join(", ")} — exceeding 120-day lead time threshold.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dept Budget vs Actual */}
      <Card className="card-premium border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-indigo">Department Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={departmentSpend} layout="vertical" barCategoryGap="25%">
              <defs>
                <linearGradient id="budgetGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(177, 55%, 39%)" />
                  <stop offset="100%" stopColor="hsl(177, 55%, 44%)" />
                </linearGradient>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(353, 33%, 58%)" />
                  <stop offset="100%" stopColor="hsl(353, 50%, 65%)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 90%)" horizontal={false} />
              <XAxis type="number" fontSize={12} tickFormatter={(v) => `$${v / 1e6}M`} stroke="hsl(210, 7%, 46%)" tickLine={false} axisLine={false} />
              <YAxis dataKey="department" type="category" fontSize={12} width={90} stroke="hsl(210, 7%, 46%)" tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v: number) => `$${(v / 1e6).toFixed(2)}M`}
                contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)" }}
              />
              <Legend wrapperStyle={{ paddingTop: "8px" }} />
              <Bar dataKey="budget" fill="url(#budgetGrad)" radius={[0, 6, 6, 0]} name="Budget" />
              <Bar dataKey="actual" fill="url(#actualGrad)" radius={[0, 6, 6, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
