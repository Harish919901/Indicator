// ─── TYPES ───
export interface Supplier {
  id: string; name: string; category: string; leadTime: number; rating: number; country: string;
}
export interface Component {
  mpn: string; description: string; supplier: string; commodity: string; unitCost: number; moq: number; leadTime: number; stock: number;
}
export interface BOMItem {
  mpn: string; description: string; qty: number; unitCost: number; supplier: string; leadTime: number;
}
export interface Customer {
  id: string; name: string; region: string; revenue: number; orders: number;
}
export interface Project {
  id: string; name: string; customer: string; status: string; value: number; startDate: string;
}
export interface Agent {
  id: string; name: string; description: string; icon: string; enabled: boolean; priority: number; assignee: string;
}

// ─── SUPPLIERS ───
export const suppliers: Supplier[] = [
  { id: "SUP-001", name: "Mouser Electronics", category: "Distributor", leadTime: 14, rating: 4.8, country: "USA" },
  { id: "SUP-002", name: "Digi-Key", category: "Distributor", leadTime: 7, rating: 4.9, country: "USA" },
  { id: "SUP-003", name: "Arrow Electronics", category: "Distributor", leadTime: 21, rating: 4.5, country: "USA" },
  { id: "SUP-004", name: "Würth Elektronik", category: "Manufacturer", leadTime: 28, rating: 4.7, country: "Germany" },
  { id: "SUP-005", name: "Yageo Corporation", category: "Manufacturer", leadTime: 35, rating: 4.3, country: "Taiwan" },
  { id: "SUP-006", name: "TDK Corporation", category: "Manufacturer", leadTime: 42, rating: 4.6, country: "Japan" },
  { id: "SUP-007", name: "Vishay Intertechnology", category: "Manufacturer", leadTime: 30, rating: 4.4, country: "USA" },
  { id: "SUP-008", name: "Murata Manufacturing", category: "Manufacturer", leadTime: 25, rating: 4.8, country: "Japan" },
];

// ─── COMPONENTS ───
export const components: Component[] = [
  { mpn: "RC0402FR-0710KL", description: "Resistor 10K 1% 0402", supplier: "Yageo Corporation", commodity: "Passives", unitCost: 0.012, moq: 5000, leadTime: 14, stock: 125000 },
  { mpn: "GRM155R71C104KA88D", description: "Cap 100nF 16V 0402", supplier: "Murata Manufacturing", commodity: "Passives", unitCost: 0.008, moq: 10000, leadTime: 21, stock: 250000 },
  { mpn: "STM32F407VGT6", description: "MCU ARM Cortex-M4 1MB Flash", supplier: "Arrow Electronics", commodity: "ICs", unitCost: 8.45, moq: 100, leadTime: 56, stock: 3200 },
  { mpn: "LM3940IT-3.3", description: "LDO Regulator 3.3V 1A TO-220", supplier: "Mouser Electronics", commodity: "Power", unitCost: 1.25, moq: 500, leadTime: 14, stock: 8500 },
  { mpn: "TPS54302DDCR", description: "Buck Converter 3A SOT-23", supplier: "Digi-Key", commodity: "Power", unitCost: 2.10, moq: 250, leadTime: 7, stock: 12000 },
  { mpn: "SN74LVC1G14DBVR", description: "Schmitt Trigger Inverter SOT-23", supplier: "Mouser Electronics", commodity: "ICs", unitCost: 0.35, moq: 1000, leadTime: 28, stock: 45000 },
  { mpn: "744771133", description: "Inductor 33uH 1.4A SMD", supplier: "Würth Elektronik", commodity: "Passives", unitCost: 0.85, moq: 500, leadTime: 35, stock: 6700 },
  { mpn: "CRCW040210K0FKED", description: "Resistor 10K 1% 0402", supplier: "Vishay Intertechnology", commodity: "Passives", unitCost: 0.015, moq: 5000, leadTime: 21, stock: 98000 },
  { mpn: "EEE-FK1V100P", description: "Cap Electrolytic 10uF 35V", supplier: "Digi-Key", commodity: "Passives", unitCost: 0.22, moq: 1000, leadTime: 14, stock: 35000 },
  { mpn: "TUSB320IRWBR", description: "USB Type-C Controller", supplier: "Arrow Electronics", commodity: "ICs", unitCost: 1.85, moq: 250, leadTime: 130, stock: 1200 },
];

// ─── BOM ───
export const sampleBOM: BOMItem[] = [
  { mpn: "STM32F407VGT6", description: "MCU ARM Cortex-M4", qty: 1, unitCost: 8.45, supplier: "Arrow Electronics", leadTime: 56 },
  { mpn: "RC0402FR-0710KL", description: "Resistor 10K 1%", qty: 24, unitCost: 0.012, supplier: "Yageo Corporation", leadTime: 14 },
  { mpn: "GRM155R71C104KA88D", description: "Cap 100nF 16V", qty: 18, unitCost: 0.008, supplier: "Murata Manufacturing", leadTime: 21 },
  { mpn: "TPS54302DDCR", description: "Buck Converter 3A", qty: 2, unitCost: 2.10, supplier: "Digi-Key", leadTime: 7 },
  { mpn: "744771133", description: "Inductor 33uH", qty: 2, unitCost: 0.85, supplier: "Würth Elektronik", leadTime: 35 },
  { mpn: "SN74LVC1G14DBVR", description: "Schmitt Trigger", qty: 4, unitCost: 0.35, supplier: "Mouser Electronics", leadTime: 28 },
  { mpn: "TUSB320IRWBR", description: "USB-C Controller", qty: 1, unitCost: 1.85, supplier: "Arrow Electronics", leadTime: 130 },
];

// ─── CUSTOMERS ───
export const customers: Customer[] = [
  { id: "CUS-001", name: "TechVision GmbH", region: "EMEA", revenue: 2450000, orders: 42 },
  { id: "CUS-002", name: "NovaTech Inc.", region: "Americas", revenue: 3120000, orders: 58 },
  { id: "CUS-003", name: "Shenzhen MicroElec", region: "APAC", revenue: 1870000, orders: 31 },
  { id: "CUS-004", name: "AutoDrive Systems", region: "EMEA", revenue: 4500000, orders: 23 },
  { id: "CUS-005", name: "MedDevice Corp", region: "Americas", revenue: 1950000, orders: 17 },
  { id: "CUS-006", name: "IoTConnect Ltd", region: "EMEA", revenue: 890000, orders: 65 },
];

// ─── PROJECTS ───
export const projects: Project[] = [
  { id: "PRJ-001", name: "EV Charger Controller v2", customer: "AutoDrive Systems", status: "In Production", value: 1200000, startDate: "2025-01-15" },
  { id: "PRJ-002", name: "IoT Gateway Module", customer: "IoTConnect Ltd", status: "Prototype", value: 350000, startDate: "2025-06-01" },
  { id: "PRJ-003", name: "Medical Monitor PCB", customer: "MedDevice Corp", status: "Quoting", value: 780000, startDate: "2025-09-10" },
  { id: "PRJ-004", name: "5G Antenna Board", customer: "NovaTech Inc.", status: "In Production", value: 2100000, startDate: "2024-11-20" },
  { id: "PRJ-005", name: "Industrial Sensor Hub", customer: "TechVision GmbH", status: "Design Review", value: 450000, startDate: "2025-08-05" },
];

// ─── AGENTS ───
export const agents: Agent[] = [
  { id: "agent-excel-dashboard", name: "Excel to Dashboard", description: "Upload spreadsheets and auto-generate visual dashboards", icon: "BarChart3", enabled: true, priority: 1, assignee: "System" },
  { id: "agent-excel-quote", name: "BOM to Quote", description: "Transform BOMs into complete sales quotations", icon: "FileSpreadsheet", enabled: true, priority: 2, assignee: "System" },
  { id: "agent-ai-insights", name: "AI Insights", description: "Conversational AI for data analysis and actionable insights", icon: "Brain", enabled: true, priority: 3, assignee: "System" },
  { id: "agent-sap-bridge", name: "AI Bridge for SAP", description: "Integrate and sync data from SAP ERP systems", icon: "Plug", enabled: true, priority: 4, assignee: "System" },
  { id: "agent-drag-drop", name: "Drag & Drop Builder", description: "Build custom reports with a visual drag-and-drop interface", icon: "LayoutGrid", enabled: true, priority: 5, assignee: "System" },
  { id: "agent-reports", name: "Pre-Engineered Reports", description: "One-click access to 20+ standard EMS reports", icon: "FileText", enabled: true, priority: 6, assignee: "System" },
  { id: "agent-templates", name: "Template Library", description: "Browse and use pre-built report templates", icon: "Library", enabled: true, priority: 7, assignee: "System" },
];

// ─── KPI DATA ───
export const kpiData = {
  totalRevenue: 14780000,
  activeProjects: 5,
  openPOs: 127,
  componentShortages: 3,
  avgLeadTime: 28,
  onTimeDelivery: 94.2,
  qualityYield: 99.1,
  supplierCount: 8,
};

// ─── CHART DATA ───
export const spendByCommodity = [
  { name: "Passives", value: 245000, fill: "hsl(177, 55%, 39%)" },
  { name: "ICs", value: 520000, fill: "hsl(232, 48%, 48%)" },
  { name: "Power", value: 180000, fill: "hsl(45, 100%, 50%)" },
  { name: "Connectors", value: 95000, fill: "hsl(353, 33%, 58%)" },
  { name: "PCBs", value: 310000, fill: "hsl(210, 7%, 46%)" },
];

export const monthlyRevenue = [
  { month: "Jul", revenue: 980000, orders: 45 },
  { month: "Aug", revenue: 1120000, orders: 52 },
  { month: "Sep", revenue: 1350000, orders: 61 },
  { month: "Oct", revenue: 1180000, orders: 48 },
  { month: "Nov", revenue: 1450000, orders: 67 },
  { month: "Dec", revenue: 1290000, orders: 55 },
  { month: "Jan", revenue: 1580000, orders: 72 },
  { month: "Feb", revenue: 1680000, orders: 78 },
];

export const departmentSpend = [
  { department: "Purchasing", budget: 4500000, actual: 4120000 },
  { department: "Production", budget: 3200000, actual: 3450000 },
  { department: "Quality", budget: 800000, actual: 720000 },
  { department: "R&D", budget: 1500000, actual: 1380000 },
  { department: "Sales", budget: 600000, actual: 580000 },
];

// ─── TEMPLATE CATEGORIES ───
export const templateCategories = [
  { id: "istvon", name: "ISTVON", count: 4, description: "Industry-standard templates for vendor onboarding" },
  { id: "commodity", name: "Commodity Mapping", count: 6, description: "Map components to commodity groups" },
  { id: "bom-input", name: "BOM Input", count: 5, description: "Standardized BOM entry templates" },
  { id: "rfq-input", name: "RFQ Input", count: 3, description: "Request for Quote templates" },
  { id: "line-card", name: "Line Card", count: 4, description: "Supplier line card management" },
  { id: "premium", name: "Premium", count: 7, description: "Material Pricing, Surface Finish, Machine Hour Rate" },
];

// ─── REPORT TYPES ───
export const reportTypes = [
  { id: "spend-analysis", name: "Commodity-wise Spend Analysis", department: "Purchasing", usageCount: 342, trending: true },
  { id: "bom-breakdown", name: "BOM & Component-Level Breakdown", department: "Production", usageCount: 289, trending: true },
  { id: "customer-sales", name: "Customer-wise Sales (Day/Month/Year)", department: "Sales", usageCount: 256, trending: false },
  { id: "inventory", name: "Inventory Status Report", department: "Production", usageCount: 198, trending: false },
  { id: "iqc-report", name: "IQC Inspection Report", department: "Quality", usageCount: 167, trending: false },
  { id: "grn-pos", name: "GRN & PO Tracking", department: "Purchasing", usageCount: 234, trending: true },
  { id: "aging-customer", name: "Aging Analysis — Customer", department: "Finance", usageCount: 145, trending: false },
  { id: "aging-supplier", name: "Aging Analysis — Supplier", department: "Finance", usageCount: 132, trending: false },
  { id: "lead-time-120", name: "MPNs Exceeding 120-Day Lead Time", department: "Purchasing", usageCount: 278, trending: true },
  { id: "org-drilldown", name: "Org/Dept/BOM-wise Drilldown", department: "Production", usageCount: 189, trending: false },
  { id: "quality-yield", name: "Quality Yield Report", department: "Quality", usageCount: 156, trending: false },
  { id: "supplier-scorecard", name: "Supplier Scorecard", department: "Purchasing", usageCount: 211, trending: true },
];

// ─── SAP TABLES (enhanced) ───
export const sapTables = [
  { name: "MARA", description: "Material Master", records: 45230, lastSync: "2026-02-24 08:30", status: "synced", category: "Material", columns: 48, keyFields: ["MATNR", "MTART", "MATKL"], syncMode: "Delta" as const },
  { name: "EKPO", description: "Purchase Order Items", records: 128450, lastSync: "2026-02-24 08:30", status: "synced", category: "Procurement", columns: 53, keyFields: ["EBELN", "EBELP", "MATNR", "NETWR"], syncMode: "Delta" as const },
  { name: "STPO", description: "BOM Items", records: 67890, lastSync: "2026-02-24 06:00", status: "synced", category: "Production", columns: 32, keyFields: ["STLNR", "STLKN", "IDNRK"], syncMode: "Full" as const },
  { name: "QALS", description: "Quality Inspection Lots", records: 12340, lastSync: "2026-02-24 08:30", status: "synced", category: "Quality", columns: 28, keyFields: ["PRUEFLOS", "MATNR", "STAT"], syncMode: "Delta" as const },
  { name: "VBAP", description: "Sales Order Items", records: 89120, lastSync: "2026-02-23 22:00", status: "stale", category: "Sales", columns: 41, keyFields: ["VBELN", "POSNR", "MATNR"], syncMode: "Full" as const },
  { name: "AFKO", description: "Production Order Header", records: 34560, lastSync: "2026-02-24 08:30", status: "synced", category: "Production", columns: 35, keyFields: ["AUFNR", "PLNBEZ", "GAMNG"], syncMode: "Delta" as const },
];

// ─── SAP FIELD MAPPINGS ───
export const sapFieldMappings = [
  { sapField: "EKPO.EBELN", normalized: "PO Number", dataType: "CHAR(10)", example: "4500000001" },
  { sapField: "EKPO.EBELP", normalized: "PO Line Item", dataType: "NUMC(5)", example: "00010" },
  { sapField: "EKPO.MATNR", normalized: "Material Number", dataType: "CHAR(18)", example: "MAT-PCB-001" },
  { sapField: "EKPO.TXZ01", normalized: "Material Description", dataType: "CHAR(40)", example: "PCB Standoff M3x5mm" },
  { sapField: "EKPO.MENGE", normalized: "Quantity", dataType: "QUAN(13)", example: "200.000" },
  { sapField: "EKPO.MEINS", normalized: "Unit of Measure", dataType: "UNIT(3)", example: "EA" },
  { sapField: "EKPO.NETWR", normalized: "Net Order Value", dataType: "CURR(15)", example: "1032.00" },
  { sapField: "EKPO.WAERS", normalized: "Currency", dataType: "CUKY(5)", example: "INR" },
  { sapField: "EKPO.LIFNR", normalized: "Supplier ID", dataType: "CHAR(10)", example: "VND-0042" },
  { sapField: "EKPO.WERKS", normalized: "Plant Code", dataType: "CHAR(4)", example: "1000" },
  { sapField: "EKPO.LGORT", normalized: "Storage Location", dataType: "CHAR(4)", example: "0001" },
  { sapField: "EKPO.MATKL", normalized: "Material Group", dataType: "CHAR(9)", example: "ELEC-COMP" },
];

// ─── SAP ALERT CONFIG ───
export const sapAlertConfig = [
  { id: "shortage-risk", label: "Shortage Risk", description: "Alert when component stock falls below safety threshold", enabled: true, threshold: "< 14 days supply", severity: "critical" as const },
  { id: "stale-data", label: "Stale Data", description: "Alert when table sync exceeds freshness window", enabled: true, threshold: "> 8 hours", severity: "warning" as const },
  { id: "quality-gate", label: "Quality Gate", description: "Alert on new or changed quality inspection lots", enabled: true, threshold: "Any new QALS entry", severity: "info" as const },
  { id: "price-variance", label: "Price Variance", description: "Alert when PO net value deviates from standard cost", enabled: false, threshold: "> 15% deviation", severity: "warning" as const },
];

// ─── SAP PURCHASE ORDERS (from Excel) ───
export const sapPurchaseOrders = [
  { po: "4500000001", item: "00010", supplier: "Pinnacle Mechanical Parts", material: "PCB Standoff M3x5mm", qty: 200, netValue: 1032, currency: "INR", status: "Completed" },
  { po: "4500000001", item: "00020", supplier: "Meridian Technologies", material: "Op-Amp SOT23-5", qty: 500, netValue: 174, currency: "USD", status: "Completed" },
  { po: "4500000016", item: "00010", supplier: "Meridian Technologies", material: "MCU ARM Cortex-M4", qty: 1000, netValue: 3484, currency: "USD", status: "Partial" },
  { po: "4500000010", item: "00010", supplier: "Pacific Trading", material: "Wi-Fi Module 802.11", qty: 5000, netValue: 23610, currency: "USD", status: "Completed" },
  { po: "4500000021", item: "00010", supplier: "Vertex Electronic", material: "Zener Diode 3.3V", qty: 2000, netValue: 72, currency: "USD", status: "Completed" },
  { po: "4500000034", item: "00010", supplier: "Solaris Cable & Wire", material: "Ribbon Cable 10-Pin", qty: 500, netValue: 5642, currency: "INR", status: "Partial" },
  { po: "4500000027", item: "00010", supplier: "Nexus Semiconductors", material: "Zener Diode 3.3V", qty: 5000, netValue: 159, currency: "USD", status: "Open" },
  { po: "4500000032", item: "00010", supplier: "Atlas Precision Eng.", material: "PCB Prototype Service", qty: 2, netValue: 116909, currency: "INR", status: "Partial" },
];

// ─── SAP ALERTS ───
export const sapAlerts = [
  { id: 1, level: "critical" as const, message: "Shortage risk for TUSB320IRWBR — only 1,200 units remaining, 14-day supply at current burn rate", action: "View Component", actionTarget: "component" },
  { id: 2, level: "critical" as const, message: "PO 4500000032 — PCB Prototype Service net value ₹116,909 exceeds standard cost by 23%", action: "Review PO", actionTarget: "po" },
  { id: 3, level: "warning" as const, message: "VBAP (Sales Orders) table sync is 10h stale — last sync Feb 23, 22:00", action: "Force Sync", actionTarget: "sync" },
  { id: 4, level: "warning" as const, message: "MCU ARM Cortex-M4 lead time extended to 56 days — 3 open POs affected", action: "View Impact", actionTarget: "component" },
  { id: 5, level: "info" as const, message: "New quality gate QG-042 detected in SAP QALS for material MAT-PCB-001", action: "Review", actionTarget: "quality" },
  { id: 6, level: "info" as const, message: "Delta sync completed — 1,247 records processed across 5 tables in 3.2s", action: "View Log", actionTarget: "sync" },
];

// ─── USERS ───
export const mockUsers = [
  { id: "USR-001", name: "Rajesh Kumar", email: "rajesh@sota.com", role: "CEO", avatar: "RK" },
  { id: "USR-002", name: "Priya Sharma", email: "priya@sota.com", role: "Manager", avatar: "PS" },
  { id: "USR-003", name: "Anil Patel", email: "anil@sota.com", role: "Manager", avatar: "AP" },
  { id: "USR-004", name: "Deepa Nair", email: "deepa@sota.com", role: "Employee", avatar: "DN" },
  { id: "USR-005", name: "Vikram Singh", email: "vikram@sota.com", role: "Employee", avatar: "VS" },
];
