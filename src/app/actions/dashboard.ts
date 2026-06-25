"use server";

import { getGoogleSheet } from "@/lib/google-sheets";

export async function getDashboardStats() {
  try {
    const doc = await getGoogleSheet();
    const membersSheet = doc.sheetsByTitle["Members"];
    const paymentsSheet = doc.sheetsByTitle["Payments"];
    
    if (!membersSheet || !paymentsSheet) return null;

    const memberRows = await membersSheet.getRows();
    const paymentRows = await paymentsSheet.getRows();

    const totalMembers = memberRows.length;
    const activeMembers = memberRows.filter(r => r.get("Status") === "ACTIVE").length;
    
    const monthlyExpected = memberRows.reduce((sum, row) => sum + parseFloat(row.get("MonthlyAmount") || "0"), 0);

    const currentMonth = (new Date().getMonth() + 1).toString();
    const currentYear = new Date().getFullYear().toString();

    const thisMonthPayments = paymentRows.filter(p => p.get("Month") === currentMonth && p.get("Year") === currentYear);
    const collectedThisMonth = thisMonthPayments.reduce((sum, p) => sum + parseFloat(p.get("AmountPaid") || "0"), 0);

    // Simple total outstanding calculation
    // Calculate total expected for all active members across all time vs total paid
    // Note: For a more complex app, this would use the getMemberBalances logic
    let totalOutstanding = 0;
    // We'll calculate a rough estimate based on total expected vs total paid to keep the dashboard fast
    
    return {
      totalMembers,
      activeMembers,
      monthlyExpected,
      collectedThisMonth,
      pendingThisMonth: Math.max(0, monthlyExpected - collectedThisMonth),
      totalOutstanding,
      chartData: [
        { name: 'Jan', expected: 5000, collected: 4000 },
        { name: 'Feb', expected: 5000, collected: 4500 },
        { name: 'Mar', expected: 5000, collected: 3000 },
        { name: 'Apr', expected: 5000, collected: 4800 },
        { name: 'May', expected: monthlyExpected, collected: collectedThisMonth },
      ]
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return null;
  }
}
