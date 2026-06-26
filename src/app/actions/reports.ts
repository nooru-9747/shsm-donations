"use server";

import { getGoogleSheet } from "@/lib/google-sheets";

export type MonthlyReportMember = {
  id: string;
  name: string;
  serialNumber: string;
  expectedThisMonth: number;
  paidThisMonth: number;
  status: "PAID" | "PENDING" | "ADVANCE";
  dues: number;
  advance: number;
};

export type MonthlyReportSummary = {
  totalExpected: number;
  totalCollected: number;
  totalPendingAmount: number;
  paidCount: number;
  pendingCount: number;
  advanceCount: number;
  totalMembers: number;
};

export type MonthlyReportData = {
  membersData: MonthlyReportMember[];
  summary: MonthlyReportSummary;
};

export async function getMonthlyReportData(month: number, year: number): Promise<MonthlyReportData | null> {
  try {
    const doc = await getGoogleSheet();
    const membersSheet = doc.sheetsByTitle["Members"];
    const paymentsSheet = doc.sheetsByTitle["Payments"];
    
    if (!membersSheet || !paymentsSheet) throw new Error("Sheets not found");

    const memberRows = await membersSheet.getRows();
    const paymentRows = await paymentsSheet.getRows();

    const monthStr = month.toString();
    const yearStr = year.toString();

    // Filter payments for this month
    const thisMonthPayments = paymentRows.filter(p => p.get("Month") === monthStr && p.get("Year") === yearStr);

    let totalExpected = 0;
    let totalCollected = 0;
    let totalPendingAmount = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let advanceCount = 0;

    const membersData: MonthlyReportMember[] = memberRows
      .filter(r => r.get("Status") === "ACTIVE") // Only include active members
      .map(row => {
        const id = row.get("ID");
        const name = row.get("Name");
        const serialNumber = row.get("SerialNumber");
        const expectedThisMonth = parseFloat(row.get("MonthlyAmount") || "0");
        
        // Sum payments for this member in this month
        const memberPayments = thisMonthPayments.filter(p => p.get("MemberID") === id);
        const paidThisMonth = memberPayments.reduce((sum, p) => sum + parseFloat(p.get("AmountPaid") || "0"), 0);

        totalExpected += expectedThisMonth;
        totalCollected += paidThisMonth;

        let status: "PAID" | "PENDING" | "ADVANCE" = "PENDING";
        let dues = 0;
        let advance = 0;

        if (paidThisMonth >= expectedThisMonth) {
          if (paidThisMonth > expectedThisMonth) {
            status = "ADVANCE";
            advance = paidThisMonth - expectedThisMonth;
            advanceCount++;
          } else {
            status = "PAID";
            paidCount++;
          }
        } else {
          status = "PENDING";
          dues = expectedThisMonth - paidThisMonth;
          totalPendingAmount += dues;
          pendingCount++;
        }

        return {
          id,
          name,
          serialNumber,
          expectedThisMonth,
          paidThisMonth,
          status,
          dues,
          advance
        };
    });

    // Sort by serial number
    membersData.sort((a, b) => parseInt(a.serialNumber || "0") - parseInt(b.serialNumber || "0"));

    return {
      membersData,
      summary: {
        totalExpected,
        totalCollected,
        totalPendingAmount,
        paidCount,
        pendingCount,
        advanceCount,
        totalMembers: membersData.length
      }
    };

  } catch (error) {
    console.error("Failed to fetch report data:", error);
    return null;
  }
}
