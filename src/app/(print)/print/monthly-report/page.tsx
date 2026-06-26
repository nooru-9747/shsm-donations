import { getMonthlyReportData } from "@/app/actions/reports";
import PrintTrigger from "./PrintTrigger";
import { format } from "date-fns";

type Props = {
  searchParams: Promise<{ month?: string; year?: string }>;
};

export default async function PrintReportPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const month = params.month ? parseInt(params.month) : currentMonth;
  const year = params.year ? parseInt(params.year) : currentYear;

  const data = await getMonthlyReportData(month, year);

  if (!data) {
    return (
      <div style={{ padding: "32px", textAlign: "center", color: "#dc2626" }}>
        Failed to load report data. Please check database connection.
      </div>
    );
  }

  const monthName = format(new Date(year, month - 1, 1), "MMMM yyyy");
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const css = `
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background: #f1f5f9; }

    .no-print { padding: 16px 20px; display: flex; justify-content: flex-end; }
    @media print { .no-print { display: none !important; } }

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 14mm 14mm 12mm 14mm;
      background: white;
      font-size: 10.5pt;
      color: #111;
    }
    @media screen {
      .page {
        box-shadow: 0 4px 32px rgba(0,0,0,0.18);
        margin: 0 auto 24px auto;
      }
    }
    @media print {
      html, body { background: white !important; }
      .page {
        width: 100%;
        margin: 0;
        padding: 10mm 12mm;
        box-shadow: none;
      }
    }

    /* Header */
    .org-name { font-size: 20pt; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin: 0 0 4px; }
    .report-title { font-size: 12pt; font-weight: 600; text-align: center; margin: 0 0 2px; color: #444; }
    .report-month { font-size: 10pt; text-align: center; color: #666; margin: 0 0 14px; }
    .divider-thick { border: none; border-top: 2.5px solid #1a3a2a; margin: 0 0 14px; }
    .divider-thin { border: none; border-top: 1px solid #ccc; margin: 12px 0; }

    /* Summary grid */
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
    .summary-box { border: 1px solid #ccc; border-radius: 4px; padding: 9px 10px; }
    .summary-label { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.5px; color: #777; font-weight: 700; margin-bottom: 5px; }
    .summary-val { font-size: 16pt; font-weight: 800; line-height: 1; }
    .green { color: #15803d; }
    .red { color: #dc2626; }
    .amber { color: #b45309; }
    .blue { color: #1d4ed8; }

    /* Table */
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    colgroup col.c-sl   { width: 9%; }
    colgroup col.c-name { width: 30%; }
    colgroup col.c-exp  { width: 16%; }
    colgroup col.c-paid { width: 16%; }
    colgroup col.c-dues { width: 16%; }
    colgroup col.c-stat { width: 13%; }

    thead tr th {
      background: #1a3a2a;
      color: #fff;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      padding: 6px 7px;
      text-align: left;
    }
    thead tr th.right { text-align: right; }
    thead tr th.center { text-align: center; }

    tbody tr td {
      padding: 5px 7px;
      font-size: 10pt;
      border-bottom: 1px solid #e5e7eb;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    tbody tr td.right { text-align: right; }
    tbody tr td.center { text-align: center; }
    tbody tr:nth-child(even) td { background: #f8fafc; }

    .badge-paid    { color: #15803d; font-weight: 700; font-size: 9pt; }
    .badge-pending { color: #dc2626; font-weight: 700; font-size: 9pt; }
    .badge-advance { color: #1d4ed8; font-weight: 700; font-size: 9pt; }

    /* Footer */
    .report-footer {
      margin-top: 20px;
      border-top: 1px solid #ccc;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #999;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="no-print">
        <PrintTrigger />
      </div>

      <div className="page">
        {/* Header */}
        <p className="org-name">SHSM Donations</p>
        <p className="report-title">Monthly Donation Status Report</p>
        <p className="report-month">For the month of {monthName}</p>
        <hr className="divider-thick" />

        {/* Summary */}
        <div className="summary-grid">
          <div className="summary-box">
            <div className="summary-label">Total Collected</div>
            <div className="summary-val green">₹{data.summary.totalCollected}</div>
          </div>
          <div className="summary-box">
            <div className="summary-label">Total Dues</div>
            <div className="summary-val red">₹{data.summary.totalPendingAmount}</div>
          </div>
          <div className="summary-box">
            <div className="summary-label">Paid / Advance</div>
            <div className="summary-val green">{data.summary.paidCount} / {data.summary.advanceCount}</div>
          </div>
          <div className="summary-box">
            <div className="summary-label">Pending Members</div>
            <div className="summary-val amber">{data.summary.pendingCount} of {data.summary.totalMembers}</div>
          </div>
        </div>

        <hr className="divider-thin" />

        {/* Table */}
        <table>
          <colgroup>
            <col className="c-sl" />
            <col className="c-name" />
            <col className="c-exp" />
            <col className="c-paid" />
            <col className="c-dues" />
            <col className="c-stat" />
          </colgroup>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Member Name</th>
              <th className="right">Expected (₹)</th>
              <th className="right">Paid (₹)</th>
              <th className="right">Dues (₹)</th>
              <th className="center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.membersData.map((member) => (
              <tr key={member.id}>
                <td>{member.serialNumber}</td>
                <td>{member.name}</td>
                <td className="right">{member.expectedThisMonth}</td>
                <td className="right">{member.paidThisMonth > 0 ? member.paidThisMonth : "—"}</td>
                <td className="right">{member.dues > 0 ? member.dues : "—"}</td>
                <td className="center">
                  {member.status === "PAID"    && <span className="badge-paid">PAID</span>}
                  {member.status === "PENDING" && <span className="badge-pending">PENDING</span>}
                  {member.status === "ADVANCE" && <span className="badge-advance">ADV+₹{member.advance}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="report-footer">
          <span>SHSM Donations Management System</span>
          <span>Report generated on {today}</span>
        </div>
      </div>
    </>
  );
}
