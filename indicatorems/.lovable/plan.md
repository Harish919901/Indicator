

## Plan: Excel to Dashboard — 4-Step Stepper Wizard Implementation

### Overview

Rewrite `src/pages/ExcelDashboard.tsx` from a simple upload-then-view page into a 4-step wizard: **Intake → Transform → Analyze → Visualize**, following the document's specifications.

---

### Step 1: Data Intake ("Intake")

- Horizontal stepper bar at the top (same visual pattern as SAP Bridge: numbered circles, active in Slate Teal, completed in Deep Indigo, locked in Cool Gray)
- Existing drag-and-drop upload zone (keep current styling)
- After upload, show a **Column Mapping** interface: a table showing uploaded headers on the left and dropdown selectors on the right to map to system fields (Supplier Name, Commodity Category, Spend Amount, MPN, Qty, Unit Cost)
- "Skip to Quote" shortcut button for power users — navigates to `/excel-quote`
- File metadata badge row (filename, rows × columns)

### Step 2: Smart Transformation ("Transform")

- **Automated Cleansing Summary**: Show a card with cleansing stats (e.g., "14 MPN formats standardized", "3 duplicate rows removed", "2 blank fields filled")
- **Data Cleaning Log**: A scrollable panel showing before/after diffs for each correction (raw value → corrected value, with correction type badge)
- **Before & After Preview**: Side-by-side mini-tables showing raw data vs. standardized data so users can verify transformations
- **Locked** until Step 1 mapping is confirmed

### Step 3: Intelligence & LLM Reasoning ("Analyze")

- **Purpose Selector**: Radio group asking "What is the purpose of this upload?" with options: Deep Analysis, Create Analytics/Reports, Generate RFQ, Sales Quote
- If "Sales Quote" or "RFQ" is selected, show a recommendation banner: "We recommend switching to the BOM to Quote agent" with a navigation button
- **LLM Switcher**: A prominent toggle/radio group to select the analysis model:
  - Claude 3.5 Sonnet (recommended for detailed reasoning & anomalies)
  - GPT-4o (best for high-speed summaries)
  - Local LLM (for offline/private analysis)
  - Each option has a tooltip describing its strength
- **Analysis Output**: A mock AI analysis card showing identified insights (pricing anomalies, spend concentration, supplier risk)
- **Locked** until Step 2 is completed

### Step 4: Executive Visualization ("Visualize")

- Move the existing charts and KPI cards here (Cost by MPN bar chart, Spend by Commodity pie, KPI summary cards)
- Add additional visualizations: Spend Trends line, Currency Exposure breakdown
- **"Switch to Agent" button**: Handoff to BOM to Quote (`/excel-quote`) passing context
- **Locked** until Step 3 is completed

---

### Mock Data

All mock data defined inline in the component (no changes to `mockData.ts`):
- `cleaningLog`: Array of `{ raw, corrected, type, field }` entries (e.g., `{ raw: "rc0402fr07", corrected: "RC0402FR-07", type: "MPN Format", field: "MPN" }`)
- `columnMappingOptions`: System fields for the mapping dropdowns
- `llmModels`: Array of `{ id, name, description, recommended }` for the LLM switcher
- `analysisInsights`: Mock AI-generated insights for Step 3 output

### Navigation & State

- `activeStep` state (0-3) with Next/Back buttons
- Steps 2, 3, 4 locked until prior step is "confirmed" via a `stepsCompleted` state object
- Column mapping confirmation unlocks Step 2; cleansing review confirmation unlocks Step 3; purpose selection + analysis unlocks Step 4

### Files to Modify

1. **`src/pages/ExcelDashboard.tsx`** — Complete rewrite with 4-step stepper wizard

### UI Components Used
- Existing: `Card`, `Button`, `Badge`, `Table`, `Input`, `Select`, `Switch`, `Progress`
- Icons: `Upload`, `FileSpreadsheet`, `BarChart3`, `PieChart`, `Sparkles`, `CheckCircle2`, `ArrowRight`, `ArrowLeft`, `Lock`, `Brain`, `Wand2`, `RefreshCw`, `ExternalLink`
- Charts: `BarChart`, `PieChart`, `LineChart` from recharts
- Toast via `sonner` for confirmations
- `useNavigate` from react-router-dom for agent handoff navigation

