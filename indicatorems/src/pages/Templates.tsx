import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Library, Download, Copy, Eye, Search, FileSpreadsheet, Star,
  Sparkles, FileText, ShoppingCart, Microscope, Factory
} from "lucide-react";
import {
  aiPromptTemplates,
  businessCommTemplates,
  reportTemplates,
  type AIPromptTemplate,
  type BusinessCommTemplate,
  type ReportTemplate,
} from "@/data/templateData";
import AIPromptModal from "@/components/templates/AIPromptModal";
import BusinessCommModal from "@/components/templates/BusinessCommModal";
import ReportModal from "@/components/templates/ReportModal";
import ReportPreviewModal from "@/components/templates/ReportPreviewModal";

// Category accent colors (Slate Teal, Amber Gold, Deep Indigo)
const categoryColors = {
  ai: { bg: "hsl(177, 55%, 39%)", bgLight: "hsl(177, 55%, 95%)", border: "hsl(177, 55%, 39%)", text: "hsl(177, 55%, 32%)" },
  comm: { bg: "hsl(45, 100%, 50%)", bgLight: "hsl(45, 100%, 95%)", border: "hsl(45, 100%, 50%)", text: "hsl(45, 100%, 35%)" },
  report: { bg: "hsl(232, 48%, 48%)", bgLight: "hsl(232, 48%, 95%)", border: "hsl(232, 48%, 48%)", text: "hsl(232, 48%, 40%)" },
};

// Section headers
const aiSections = [
  { key: "sourcing" as const, label: "Sourcing & Procurement", icon: ShoppingCart },
  { key: "quality" as const, label: "Quality", icon: Microscope },
  { key: "production" as const, label: "Production", icon: Factory },
];

const commSections = [
  { key: "vendor" as const, label: "Vendor Communication" },
  { key: "customer" as const, label: "Customer Communication" },
  { key: "internal" as const, label: "Internal Communication" },
];

const reportSections = [
  { key: "dynamic" as const, label: "Sourcing Reports", icon: "📊" },
  { key: "inputs" as const, label: "Sourcing Inputs & Calculators", icon: "📁" },
];

export default function Templates() {
  const [search, setSearch] = useState("");
  const [selectedAI, setSelectedAI] = useState<AIPromptTemplate | null>(null);
  const [selectedComm, setSelectedComm] = useState<BusinessCommTemplate | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);

  const handleUseTemplate = (template: ReportTemplate) => {
    setSelectedReport(template);
  };

  const q = search.toLowerCase();

  const filteredAI = useMemo(
    () => aiPromptTemplates.filter((t) => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)),
    [q]
  );
  const filteredComm = useMemo(
    () => businessCommTemplates.filter((t) => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)),
    [q]
  );
  const filteredReports = useMemo(
    () => reportTemplates.filter((t) => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)),
    [q]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Library className="h-6 w-6 text-primary" />
          Template Library
        </h1>
        <p className="text-sm font-semibold text-muted-foreground">Browse and use pre-built report templates.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search templates…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ai-prompts" className="space-y-6">
        <TabsList className="h-11">
         <TabsTrigger value="ai-prompts" className="gap-1.5 text-sm">
            <Sparkles className="h-4 w-4" /> AI Prompts
          </TabsTrigger>
          <TabsTrigger value="business-comm" className="gap-1.5 text-sm">
            <FileText className="h-4 w-4" /> Business Communication
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5 text-sm">
            <FileSpreadsheet className="h-4 w-4" /> Report Templates
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: AI Prompts ── */}
        <TabsContent value="ai-prompts" className="space-y-8">
          {aiSections.map((section) => {
            const items = filteredAI.filter((t) => t.section === section.key);
            if (items.length === 0) return null;
            return (
              <div key={section.key}>
                <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                  <section.icon className="h-5 w-5" style={{ color: categoryColors.ai.bg }} />
                  {section.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((t) => (
                    <TemplateCard
                      key={t.id}
                      title={t.title}
                      subtitle={t.subtitle}
                      downloads={t.downloads}
                      actionLabel="Use Template"
                      actionIcon={<Sparkles className="h-3 w-3" />}
                      onAction={() => setSelectedAI(t)}
                      accentColor={categoryColors.ai}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {filteredAI.length === 0 && <EmptyState />}
        </TabsContent>

        {/* ── TAB 2: Business Communication ── */}
        <TabsContent value="business-comm" className="space-y-8">
          {commSections.map((section) => {
            const items = filteredComm.filter((t) => t.section === section.key);
            if (items.length === 0) return null;
            return (
              <div key={section.key}>
                <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5" style={{ color: categoryColors.comm.bg }} />
                  {section.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((t) => (
                    <TemplateCard
                      key={t.id}
                      title={t.title}
                      subtitle={t.subtitle}
                      downloads={t.downloads}
                      actionLabel="Open Template"
                      actionIcon={<FileText className="h-3 w-3" />}
                      onAction={() => setSelectedComm(t)}
                      accentColor={categoryColors.comm}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {filteredComm.length === 0 && <EmptyState />}
        </TabsContent>

        {/* ── TAB 3: Report Templates ── */}
        <TabsContent value="reports" className="space-y-8">
          {reportSections.map((section) => {
            const items = filteredReports.filter((t) => t.section === section.key);
            if (items.length === 0) return null;
            return (
              <div key={section.key}>
                <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                  <span>{section.icon}</span>
                  {section.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((t) => (
                    <TemplateCard
                      key={t.id}
                      title={t.title}
                      subtitle={t.subtitle}
                      downloads={t.downloads}
                      premium={t.premium}
                      isNew={t.isNew}
                      actionLabel={t.section === "dynamic" ? "Use this template" : "Download"}
                      actionIcon={t.section === "dynamic" ? <Eye className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                      onAction={() => t.section === "dynamic" ? setPreviewReport(t) : setSelectedReport(t)}
                      showPreview={t.section === "dynamic"}
                      onPreview={() => setPreviewReport(t)}
                      accentColor={categoryColors.report}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {filteredReports.length === 0 && <EmptyState />}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AIPromptModal template={selectedAI} open={!!selectedAI} onOpenChange={(o) => !o && setSelectedAI(null)} />
      <BusinessCommModal template={selectedComm} open={!!selectedComm} onOpenChange={(o) => !o && setSelectedComm(null)} />
      <ReportModal template={selectedReport} open={!!selectedReport} onOpenChange={(o) => !o && setSelectedReport(null)} />
      <ReportPreviewModal template={previewReport} open={!!previewReport} onOpenChange={(o) => !o && setPreviewReport(null)} onUseTemplate={handleUseTemplate} />
    </div>
  );
}

// ─── Shared Card Component ───
function TemplateCard({
  title,
  subtitle,
  downloads,
  premium,
  isNew,
  actionLabel,
  actionIcon,
  onAction,
  showPreview,
  onPreview,
  accentColor,
}: {
  title: string;
  subtitle: string;
  downloads: number;
  premium?: boolean;
  isNew?: boolean;
  actionLabel: string;
  actionIcon: React.ReactNode;
  onAction: () => void;
  showPreview?: boolean;
  onPreview?: () => void;
  accentColor?: { bg: string; bgLight: string; border: string; text: string };
}) {
  const accent = accentColor || { bg: "hsl(var(--primary))", bgLight: "hsl(var(--accent))", border: "hsl(var(--primary))", text: "hsl(var(--primary))" };

  return (
    <Card
      className="hover:shadow-md transition-all shadow-sm"
      style={{ borderColor: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent.border + "66")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
    >
      <CardContent className="p-0">
        {/* Preview Thumbnail */}
        <div className="h-28 rounded-t-lg flex items-center justify-center relative" style={{ backgroundColor: accent.bgLight }}>
          <FileSpreadsheet className="h-10 w-10" style={{ color: accent.bg + "44" }} />
          {premium && (
            <Badge className="absolute top-2 right-2 bg-amber text-amber-foreground gap-1">
              <Star className="h-3 w-3" />Premium
            </Badge>
          )}
          {isNew && (
            <Badge className="absolute top-2 right-2" style={{ backgroundColor: accent.bg, color: "#fff" }}>New</Badge>
          )}
        </div>
        <div className="p-4">
          <p className="font-semibold text-sm leading-tight">{title}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{subtitle}</p>
          <p className="text-xs text-muted-foreground mt-1.5">{downloads} downloads</p>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="text-xs gap-1 flex-1 text-white"
              style={{ backgroundColor: accent.bg }}
              onClick={onAction}
            >
              {actionIcon}
              {actionLabel}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              <Copy className="h-3 w-3" />
            </Button>
            {showPreview && onPreview ? (
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={onPreview}>
                <Eye className="h-3 w-3" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                <Eye className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">No templates match your search.</p>
    </div>
  );
}
