// ─── AI PROMPT TEMPLATES ───
export interface AIPromptTemplate {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  downloads: number;
  section: "sourcing" | "quality" | "production";
}

export const aiPromptTemplates: AIPromptTemplate[] = [
  {
    id: "ai-1",
    title: "Supplier Shortlisting Assistant",
    subtitle: "Evaluate and rank suppliers for a component based on OTD, IQC pass rate, lead time and cost data",
    downloads: 0,
    section: "sourcing",
    prompt: `You are a procurement analyst for an EMS company. Based on the supplier data provided below, evaluate and rank the suppliers for [Component Name]. Score each supplier on: OTD % (weight 40%), IQC Pass Rate % (weight 40%), Lead Time vs Committed (weight 20%). Provide a ranked list with scores, key strengths, weaknesses, and a final recommendation. Data: [Paste supplier data here]`,
  },
  {
    id: "ai-2",
    title: "Component Alternate Sourcing",
    subtitle: "Find approved alternates for a shortage part number with sourcing justification and risk assessment",
    downloads: 0,
    section: "sourcing",
    prompt: `You are a sourcing engineer for an EMS manufacturer. The following part is currently in shortage: Part Number: [XXX], Description: [XXX], Current Supplier: [XXX], Monthly Requirement: [XXX] units. Suggest 3 alternate approved sources with: supplier name, part cross-reference, lead time, risk level, and qualification steps needed.`,
  },
  {
    id: "ai-3",
    title: "Spend Analysis & Consolidation",
    subtitle: "Analyse procurement spend data and identify top savings and consolidation opportunities by commodity",
    downloads: 0,
    section: "sourcing",
    prompt: `You are a procurement manager. Analyse the spend data below and identify: 1) Top 3 commodities where consolidation will yield savings, 2) Suppliers with overlapping scope that can be merged, 3) Estimated savings % from each consolidation action. Data: [Paste spend data here]`,
  },
  {
    id: "ai-4",
    title: "PO Risk Alert Generator",
    subtitle: "Flag open POs at risk of delay based on supplier history, lead times and current shortages",
    downloads: 0,
    section: "sourcing",
    prompt: `Review the open PO data below and flag any POs at risk of delay. For each at-risk PO provide: PO number, supplier, part, reason for risk, recommended action, and escalation priority (High/Medium/Low). Data: [Paste open PO data here]`,
  },
  {
    id: "ai-5",
    title: "Supplier Negotiation Brief",
    subtitle: "Generate a structured negotiation brief for supplier contract renewal using scorecard and spend data",
    downloads: 0,
    section: "sourcing",
    prompt: `Prepare a negotiation brief for the upcoming contract renewal with [Supplier Name]. Use the scorecard data below. Include: current performance summary, areas for improvement, our negotiation objectives, suggested price targets, and opening/walk-away positions. Data: [Paste supplier scorecard data here]`,
  },
  {
    id: "ai-6",
    title: "Price Benchmarking Analysis",
    subtitle: "Compare quoted component prices against market benchmarks and suggest negotiation targets",
    downloads: 0,
    section: "sourcing",
    prompt: `Compare the quoted prices below against typical market rates for these component categories. For each line item identify if the quote is Above Market / At Market / Below Market and suggest a target negotiation price. Data: [Paste quote comparison data here]`,
  },
  {
    id: "ai-7",
    title: "DPPM Root Cause Analysis",
    subtitle: "Analyse DPPM trend data by customer and identify root causes with recommended 8D corrective actions",
    downloads: 0,
    section: "quality",
    prompt: `You are a quality engineer at an EMS company. Analyse the DPPM trend data below by customer and product. Identify: 1) Top 3 defect categories driving DPPM, 2) Likely root causes for each, 3) Recommended 8D actions with owner and timeline. Data: [Paste DPPM data here]`,
  },
  {
    id: "ai-8",
    title: "Customer Complaint 8D Draft",
    subtitle: "Auto-draft a structured 8D problem solving response from defect description and production data",
    downloads: 0,
    section: "quality",
    prompt: `Draft a formal 8D problem solving report for the following customer complaint. Customer: [XXX], Product: [XXX], Defect Description: [XXX], Quantity Affected: [XXX]. Complete all 8 disciplines with containment actions, root cause, corrective actions, and preventive actions.`,
  },
  {
    id: "ai-9",
    title: "Audit Observation Summary",
    subtitle: "Summarise ISO/IATF 16949 audit findings and prioritise closure actions by risk level",
    downloads: 0,
    section: "quality",
    prompt: `Summarise the following ISO/IATF 16949 audit observations. For each finding provide: finding number, clause reference, severity (Major/Minor/OFI), current status, recommended closure action, and target date. Prioritise by risk level. Data: [Paste audit findings here]`,
  },
  {
    id: "ai-10",
    title: "Production Deviation Alert",
    subtitle: "Analyse daily production data and suggest corrective actions",
    downloads: 0,
    section: "production",
    prompt: `Analyse the production data below for [Date] and explain the variance from target. Identify: 1) Which lines or shifts underperformed, 2) Root cause of deviation, 3) Immediate corrective actions required today, 4) Escalation needed Y/N. Data: [Paste production data here]`,
  },
  {
    id: "ai-11",
    title: "OEE Improvement Suggestions",
    subtitle: "Suggest improvement actions based on OEE breakdown",
    downloads: 0,
    section: "production",
    prompt: `Based on the OEE breakdown data below by production line, identify the top 3 improvement opportunities. For each, provide: current OEE loss %, root cause category (Availability/Performance/Quality), specific action, expected OEE gain %, and implementation timeline. Data: [Paste OEE data here]`,
  },
];

// ─── BUSINESS COMMUNICATION TEMPLATES ───
export interface BusinessCommTemplate {
  id: string;
  title: string;
  subtitle: string;
  section: "vendor" | "customer" | "internal";
  fields: { label: string; key: string; placeholder: string; type?: "text" | "textarea" | "date" }[];
  bodyTemplate: string;
  downloads: number;
}

export const businessCommTemplates: BusinessCommTemplate[] = [
  {
    id: "bc-1",
    title: "Vendor Onboarding Letter",
    subtitle: "Welcome letter for newly approved vendors with compliance requirements",
    section: "vendor",
    downloads: 234,
    fields: [
      { label: "Vendor Name", key: "vendorName", placeholder: "Enter vendor company name" },
      { label: "Contact Person", key: "contactPerson", placeholder: "Enter contact person name" },
      { label: "Date", key: "date", placeholder: "Select date", type: "date" },
      { label: "Our Company Name", key: "companyName", placeholder: "Your company name" },
      { label: "Compliance Requirements", key: "compliance", placeholder: "List specific compliance requirements", type: "textarea" },
    ],
    bodyTemplate: `Dear {contactPerson},\n\nWe are pleased to inform you that {vendorName} has been approved as a registered vendor of {companyName} effective {date}.\n\nAs part of our vendor onboarding process, please ensure compliance with the following requirements:\n{compliance}\n\nPlease submit all required documentation within 15 business days.\n\nWe look forward to a productive partnership.\n\nBest regards,\n{companyName}`,
  },
  {
    id: "bc-2",
    title: "Purchase Order Confirmation",
    subtitle: "Formal PO confirmation with terms, delivery schedule, and quality requirements",
    section: "vendor",
    downloads: 189,
    fields: [
      { label: "Supplier Name", key: "supplierName", placeholder: "Enter supplier name" },
      { label: "PO Number", key: "poNumber", placeholder: "PO-XXXX" },
      { label: "Delivery Date", key: "deliveryDate", placeholder: "Expected delivery date", type: "date" },
      { label: "Order Details", key: "orderDetails", placeholder: "Part numbers, quantities, unit prices", type: "textarea" },
    ],
    bodyTemplate: `Dear {supplierName},\n\nThis letter confirms Purchase Order {poNumber} placed with your company.\n\nOrder Details:\n{orderDetails}\n\nExpected Delivery Date: {deliveryDate}\n\nPlease acknowledge receipt of this PO within 48 hours and confirm the delivery schedule.\n\nQuality Requirements:\n- All parts must conform to IPC-A-610 Class 2 standards\n- Certificate of Conformance required with each shipment\n- Packing list must reference PO number\n\nBest regards`,
  },
  {
    id: "bc-3",
    title: "Supplier Performance Warning",
    subtitle: "Formal warning letter for suppliers with declining quality or delivery metrics",
    section: "vendor",
    downloads: 98,
    fields: [
      { label: "Supplier Name", key: "supplierName", placeholder: "Supplier company name" },
      { label: "Issue Description", key: "issueDescription", placeholder: "Describe performance issues", type: "textarea" },
      { label: "Corrective Action Deadline", key: "deadline", placeholder: "Select deadline", type: "date" },
      { label: "Metrics Data", key: "metricsData", placeholder: "OTD %, Quality %, etc.", type: "textarea" },
    ],
    bodyTemplate: `Dear {supplierName},\n\nWe are writing to formally notify you regarding performance concerns with your recent deliveries.\n\nPerformance Issues:\n{issueDescription}\n\nCurrent Metrics:\n{metricsData}\n\nWe require a formal corrective action plan by {deadline}. Failure to address these issues may result in suspension from our approved vendor list.\n\nPlease schedule a review meeting at your earliest convenience.\n\nRegards`,
  },
  {
    id: "bc-4",
    title: "Customer Quotation Cover Letter",
    subtitle: "Professional cover letter to accompany customer quotations with validity and terms",
    section: "customer",
    downloads: 312,
    fields: [
      { label: "Customer Name", key: "customerName", placeholder: "Customer company name" },
      { label: "Contact Person", key: "contactPerson", placeholder: "Customer contact name" },
      { label: "Quote Reference", key: "quoteRef", placeholder: "QT-XXXX" },
      { label: "Validity Period", key: "validity", placeholder: "e.g., 30 days" },
      { label: "Project Description", key: "projectDesc", placeholder: "Brief project description", type: "textarea" },
    ],
    bodyTemplate: `Dear {contactPerson},\n\nThank you for the opportunity to quote for {customerName}.\n\nPlease find enclosed our quotation {quoteRef} for the following project:\n{projectDesc}\n\nThis quotation is valid for {validity} from the date of issue.\n\nKey Terms:\n- Payment: Net 30 from invoice date\n- Delivery: Ex-works, FOB origin\n- Tooling: Amortized over first production order\n\nWe are confident in our ability to deliver high-quality products and look forward to your favorable response.\n\nBest regards`,
  },
  {
    id: "bc-5",
    title: "Delivery Delay Notification",
    subtitle: "Proactive customer notification about shipment delays with revised timeline",
    section: "customer",
    downloads: 156,
    fields: [
      { label: "Customer Name", key: "customerName", placeholder: "Customer name" },
      { label: "Order Number", key: "orderNumber", placeholder: "SO-XXXX" },
      { label: "Original Date", key: "originalDate", placeholder: "Original delivery date", type: "date" },
      { label: "Revised Date", key: "revisedDate", placeholder: "New expected date", type: "date" },
      { label: "Reason", key: "reason", placeholder: "Reason for delay", type: "textarea" },
    ],
    bodyTemplate: `Dear {customerName},\n\nWe regret to inform you that the delivery for Order {orderNumber} originally scheduled for {originalDate} will be delayed.\n\nReason for Delay:\n{reason}\n\nRevised Delivery Date: {revisedDate}\n\nWe sincerely apologize for any inconvenience and are taking all necessary steps to expedite the shipment. Our team is available to discuss alternative solutions.\n\nRegards`,
  },
  {
    id: "bc-6",
    title: "Quality Improvement Report",
    subtitle: "Formal quality improvement report for customer audits and compliance reviews",
    section: "customer",
    downloads: 143,
    fields: [
      { label: "Customer Name", key: "customerName", placeholder: "Customer name" },
      { label: "Report Period", key: "reportPeriod", placeholder: "e.g., Q1 2026" },
      { label: "Quality Metrics", key: "qualityMetrics", placeholder: "DPPM, FPY, OTD data", type: "textarea" },
      { label: "Improvement Actions", key: "actions", placeholder: "Actions taken and planned", type: "textarea" },
    ],
    bodyTemplate: `Quality Improvement Report\nCustomer: {customerName}\nPeriod: {reportPeriod}\n\nPerformance Summary:\n{qualityMetrics}\n\nImprovement Actions Taken:\n{actions}\n\nWe remain committed to continuous improvement and meeting your quality expectations.\n\nPrepared by Quality Department`,
  },
  {
    id: "bc-7",
    title: "Internal Audit Notice",
    subtitle: "Internal memo for upcoming quality or process audit notification",
    section: "internal",
    downloads: 167,
    fields: [
      { label: "Department", key: "department", placeholder: "Department name" },
      { label: "Audit Date", key: "auditDate", placeholder: "Scheduled date", type: "date" },
      { label: "Audit Scope", key: "auditScope", placeholder: "Areas to be audited", type: "textarea" },
      { label: "Lead Auditor", key: "leadAuditor", placeholder: "Auditor name" },
    ],
    bodyTemplate: `INTERNAL MEMO\n\nSubject: Scheduled Internal Audit - {department}\n\nThis is to notify that an internal audit has been scheduled as follows:\n\nDate: {auditDate}\nDepartment: {department}\nScope: {auditScope}\nLead Auditor: {leadAuditor}\n\nPlease ensure all relevant documentation is prepared and accessible. Department heads should brief their teams accordingly.\n\nThank you for your cooperation.`,
  },
  {
    id: "bc-8",
    title: "Engineering Change Notice",
    subtitle: "Formal ECN document for product or process changes with impact assessment",
    section: "internal",
    downloads: 205,
    fields: [
      { label: "ECN Number", key: "ecnNumber", placeholder: "ECN-XXXX" },
      { label: "Product / Part Number", key: "partNumber", placeholder: "Affected part number" },
      { label: "Change Description", key: "changeDesc", placeholder: "Describe the change", type: "textarea" },
      { label: "Impact Assessment", key: "impact", placeholder: "Impact on production, quality, cost", type: "textarea" },
      { label: "Effective Date", key: "effectiveDate", placeholder: "Implementation date", type: "date" },
    ],
    bodyTemplate: `ENGINEERING CHANGE NOTICE\n\nECN Number: {ecnNumber}\nPart Number: {partNumber}\nEffective Date: {effectiveDate}\n\nDescription of Change:\n{changeDesc}\n\nImpact Assessment:\n{impact}\n\nApproval is required from Engineering, Quality, and Production before implementation.\n\nSubmitted by Engineering Department`,
  },
  {
    id: "bc-9",
    title: "Shift Handover Report",
    subtitle: "Standardised shift handover template for production continuity",
    section: "internal",
    downloads: 278,
    fields: [
      { label: "Shift", key: "shift", placeholder: "e.g., Day Shift / Night Shift" },
      { label: "Date", key: "date", placeholder: "Handover date", type: "date" },
      { label: "Production Summary", key: "productionSummary", placeholder: "Units produced, lines active, etc.", type: "textarea" },
      { label: "Pending Issues", key: "pendingIssues", placeholder: "Issues carried forward", type: "textarea" },
      { label: "Handed Over By", key: "handedOverBy", placeholder: "Name" },
    ],
    bodyTemplate: `SHIFT HANDOVER REPORT\n\nDate: {date}\nShift: {shift}\nHanded Over By: {handedOverBy}\n\nProduction Summary:\n{productionSummary}\n\nPending Issues / Carryover:\n{pendingIssues}\n\nPlease address highlighted items at start of next shift.`,
  },
  {
    id: "bc-10",
    title: "Material Shortage Escalation",
    subtitle: "Internal escalation memo for critical material shortages impacting production",
    section: "internal",
    downloads: 89,
    fields: [
      { label: "Part Number", key: "partNumber", placeholder: "Shortage part number" },
      { label: "Required Quantity", key: "requiredQty", placeholder: "Units needed" },
      { label: "Impact Description", key: "impactDesc", placeholder: "Production lines affected, customer impact", type: "textarea" },
      { label: "Escalation Level", key: "escalationLevel", placeholder: "e.g., Level 1 / Level 2 / Critical" },
    ],
    bodyTemplate: `MATERIAL SHORTAGE ESCALATION\n\nPriority: {escalationLevel}\nPart Number: {partNumber}\nRequired Quantity: {requiredQty}\n\nImpact:\n{impactDesc}\n\nImmediate actions required:\n1. Source from alternate suppliers\n2. Check inter-plant inventory\n3. Negotiate expedited delivery\n\nPlease respond within 4 hours with an action plan.`,
  },
  {
    id: "bc-11",
    title: "Vendor Scorecard Summary",
    subtitle: "Quarterly vendor performance summary with ratings and action items",
    section: "vendor",
    downloads: 167,
    fields: [
      { label: "Vendor Name", key: "vendorName", placeholder: "Vendor company name" },
      { label: "Review Period", key: "reviewPeriod", placeholder: "e.g., Q4 2025" },
      { label: "Performance Data", key: "performanceData", placeholder: "OTD, Quality, Cost metrics", type: "textarea" },
      { label: "Action Items", key: "actionItems", placeholder: "Required improvements", type: "textarea" },
    ],
    bodyTemplate: `VENDOR PERFORMANCE SCORECARD\n\nVendor: {vendorName}\nReview Period: {reviewPeriod}\n\nPerformance Summary:\n{performanceData}\n\nAction Items:\n{actionItems}\n\nNext review scheduled for end of next quarter. Please submit improvement plans within 10 business days.`,
  },
];

// ─── REPORT TEMPLATES ───
export interface ReportTemplate {
  id: string;
  title: string;
  subtitle: string;
  section: "inputs" | "dynamic";
  downloads: number;
  premium: boolean;
  isNew?: boolean;
}

export const reportTemplates: ReportTemplate[] = [
  { id: "rt-1", title: "Commodity Group Mapping", subtitle: "Map components to standard commodity groups for spend analysis", section: "inputs", downloads: 189, premium: false },
  { id: "rt-2", title: "Standard BOM Input Sheet", subtitle: "Standardized BOM entry template with validation rules", section: "inputs", downloads: 312, premium: false },
  { id: "rt-3", title: "Supplier Line Card", subtitle: "Supplier capability and product line documentation", section: "inputs", downloads: 98, premium: false },
  { id: "rt-4", title: "Material Pricing Model", subtitle: "Structured material cost breakdown and pricing template", section: "inputs", downloads: 67, premium: true },
  { id: "rt-5", title: "Surface Finish Calculator", subtitle: "Calculate surface finish costs based on specifications", section: "inputs", downloads: 45, premium: true },
  { id: "rt-6", title: "Machine Hour Rate Sheet", subtitle: "Machine hour rate calculation with overhead allocation", section: "inputs", downloads: 89, premium: true },
  { id: "rt-7", title: "Multi-level BOM Template", subtitle: "Multi-level bill of materials with parent-child hierarchy", section: "inputs", downloads: 278, premium: false },
  { id: "rt-8", title: "Commodity Spend Tracker", subtitle: "Track and analyze spend by commodity category over time", section: "inputs", downloads: 205, premium: false },
  { id: "rt-9", title: "Vendor Scorecard Template", subtitle: "Evaluate vendor performance across key metrics", section: "inputs", downloads: 167, premium: false },
  { id: "rt-10", title: "Quote Comparison Matrix", subtitle: "Side-by-side quote comparison for sourcing decisions", section: "inputs", downloads: 143, premium: false },
  { id: "rt-11", title: "Component Shortage & Risk Report", subtitle: "Identify components at risk of shortage with mitigation plans", section: "dynamic", downloads: 0, premium: false, isNew: true },
  { id: "rt-12", title: "Supplier Scorecard Report", subtitle: "Dynamic supplier performance report with KPI calculations", section: "dynamic", downloads: 0, premium: false, isNew: true },
  { id: "rt-13", title: "Spend by Commodity Report", subtitle: "Automated spend analysis by commodity with trend charts", section: "dynamic", downloads: 0, premium: false, isNew: true },
  { id: "rt-14", title: "PO Aging & Open PO Tracker", subtitle: "Track open POs by aging buckets with escalation flags", section: "dynamic", downloads: 0, premium: false, isNew: true },
  { id: "rt-15", title: "Inventory Turnover Report", subtitle: "Calculate inventory turnover ratios by commodity and location", section: "dynamic", downloads: 0, premium: false, isNew: true },
];
