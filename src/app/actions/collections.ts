"use server";

import { getGoogleSheet } from "@/lib/google-sheets";
import { revalidatePath } from "next/cache";
import { differenceInMonths, startOfMonth } from "date-fns";

export async function getMemberBalances() {
  try {
    const doc = await getGoogleSheet();
    const membersSheet = doc.sheetsByTitle["Members"];
    const paymentsSheet = doc.sheetsByTitle["Payments"];
    
    if (!membersSheet || !paymentsSheet) return [];

    const memberRows = await membersSheet.getRows();
    const paymentRows = await paymentsSheet.getRows();

    const currentMonth = startOfMonth(new Date());

    return memberRows.map((row) => {
      const id = row.get("ID");
      const joinDate = new Date(row.get("JoinDate"));
      const monthlyAmount = parseFloat(row.get("MonthlyAmount") || "0");
      
      // Calculate months since join (including current month)
      const monthsActive = differenceInMonths(currentMonth, startOfMonth(joinDate)) + 1;
      const totalExpected = monthsActive > 0 ? monthsActive * monthlyAmount : 0;

      // Calculate total paid by this member
      const memberPayments = paymentRows.filter(p => p.get("MemberID") === id);
      const totalPaid = memberPayments.reduce((sum, p) => sum + parseFloat(p.get("AmountPaid") || "0"), 0);

      const diff = totalExpected - totalPaid;
      const outstanding = diff > 0 ? diff : 0;
      const advance = diff < 0 ? Math.abs(diff) : 0;

      return {
        id,
        name: row.get("Name"),
        serialNumber: row.get("SerialNumber"),
        mobileNumber: row.get("MobileNumber"),
        monthlyAmount,
        totalExpected,
        totalPaid,
        outstanding,
        advance,
      };
    });
  } catch (error) {
    console.error("Failed to fetch balances:", error);
    return [];
  }
}

export async function markPayment(formData: FormData) {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle["Payments"];
    if (!sheet) throw new Error("Payments sheet not found");

    const amount = parseFloat(formData.get("amount") as string);
    const expected = parseFloat(formData.get("expected") as string);
    
    let status = "UNPAID";
    if (amount >= expected) status = "PAID";
    else if (amount > 0) status = "PARTIAL";

    const date = new Date();

    await sheet.addRow({
      PaymentID: Date.now().toString(),
      MemberID: formData.get("memberId") as string,
      CollectorID: formData.get("collectorId") as string || "ADMIN",
      AmountPaid: amount.toString(),
      Month: (date.getMonth() + 1).toString(),
      Year: date.getFullYear().toString(),
      PaymentDate: date.toISOString().split('T')[0],
      Status: status,
      Remarks: formData.get("remarks") as string || "",
    });

    revalidatePath("/collections");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to mark payment:", error);
    return { success: false, error: error.message };
  }
}
