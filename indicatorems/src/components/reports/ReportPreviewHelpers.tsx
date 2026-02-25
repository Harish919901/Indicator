import { ReactNode } from "react";

interface KpiCardProps {
  icon: ReactNode;
  value: string;
  label: string;
}

export function KpiCard({ icon, value, label }: KpiCardProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-sm font-bold leading-tight">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

interface MiniTableProps {
  headers: string[];
  rows: (string | number)[][];
}

export function MiniTable({ headers, rows }: MiniTableProps) {
  return (
    <div className="overflow-auto rounded border text-[11px]">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            {headers.map((h) => (
              <th key={h} className="px-2 py-1.5 text-left font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">
              {row.map((cell, j) => (
                <td key={j} className="px-2 py-1 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface AlertItemProps {
  color: string;
  title: string;
  description: string;
}

export function AlertItem({ color, title, description }: AlertItemProps) {
  return (
    <div className={`flex items-start gap-2 rounded border-l-4 px-3 py-2 text-[11px] bg-muted/20`} style={{ borderLeftColor: color }}>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
