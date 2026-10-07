export function agentPrice(base: number, type: string, value: number) {
  return type === "percent" ? Math.round(base * (1 + value / 100) * 100) / 100 : base + value;
}

export function downloadCsv(name: string, rows: (string | number | null | undefined)[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = name;
  a.click();
}

export const AGENT_REF_KEY = "pokkali_agent_ref";
