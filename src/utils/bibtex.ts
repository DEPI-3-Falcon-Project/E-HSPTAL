import type { ReportData } from "../types";

export function toBibtex(report: ReportData): string {
  const extras = report.extras
    ? Object.entries(report.extras)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ")
    : "";

  return `
@report{
  name = {${report.name}},
  type = {${report.type}},
  contact = {${report.contact}},
  location = {${report.location}},
  description = {${report.description}},
  extras = {${extras}}
}`;
}
