"use server";

import { getGoogleSheet } from "@/lib/google-sheets";
import { revalidatePath } from "next/cache";

export async function getMembers() {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle["Members"];
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows.map((row) => ({
      id: row.get("ID"),
      serialNumber: row.get("SerialNumber"),
      name: row.get("Name"),
      address: row.get("Address"),
      mobileNumber: row.get("MobileNumber"),
      monthlyAmount: row.get("MonthlyAmount"),
      joinDate: row.get("JoinDate"),
      status: row.get("Status"),
      notes: row.get("Notes"),
    }));
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return [];
  }
}

export async function getMember(id: string) {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle["Members"];
    if (!sheet) return null;

    const rows = await sheet.getRows();
    console.log("Looking for ID:", id);
    rows.forEach((r, idx) => {
      console.log(`Row ${idx} ID:`, r.get("ID"), "| Type:", typeof r.get("ID"));
    });
    const row = rows.find(r => String(r.get("ID")).trim() === String(id).trim());
    if (!row) {
      console.log("No matching row found!");
      return null;
    }

    return {
      id: row.get("ID"),
      serialNumber: row.get("SerialNumber"),
      name: row.get("Name"),
      address: row.get("Address"),
      mobileNumber: row.get("MobileNumber"),
      monthlyAmount: row.get("MonthlyAmount"),
      joinDate: row.get("JoinDate"),
      status: row.get("Status"),
      notes: row.get("Notes"),
    };
  } catch (error) {
    console.error("Failed to fetch member:", error);
    return null;
  }
}

export async function addMember(formData: FormData) {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle["Members"];
    if (!sheet) throw new Error("Members sheet not found");

    const newId = Date.now().toString();
    const rows = await sheet.getRows();
    const nextSerial = rows.length > 0 
      ? parseInt(rows[rows.length - 1].get("SerialNumber") || "0") + 1 
      : 1;

    await sheet.addRow({
      ID: newId,
      SerialNumber: String(nextSerial).padStart(4, '0'),
      Name: formData.get("name") as string,
      Address: formData.get("address") as string,
      MobileNumber: formData.get("mobileNumber") as string,
      MonthlyAmount: formData.get("monthlyAmount") as string,
      JoinDate: new Date().toISOString().split('T')[0],
      Status: "ACTIVE",
      Notes: formData.get("notes") as string || "",
    });

    revalidatePath("/members");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add member:", error);
    return { success: false, error: error.message };
  }
}

export async function updateMember(id: string, formData: FormData) {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle["Members"];
    if (!sheet) throw new Error("Members sheet not found");

    const rows = await sheet.getRows();
    const row = rows.find(r => String(r.get("ID")).trim() === String(id).trim());
    if (!row) throw new Error("Member not found");

    row.set("Name", formData.get("name") as string);
    row.set("Address", formData.get("address") as string);
    row.set("MobileNumber", formData.get("mobileNumber") as string);
    row.set("MonthlyAmount", formData.get("monthlyAmount") as string);
    row.set("Status", formData.get("status") as string);
    row.set("Notes", formData.get("notes") as string || "");

    await row.save();
    revalidatePath("/members");
    revalidatePath(`/members/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update member:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMember(id: string) {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle["Members"];
    if (!sheet) throw new Error("Members sheet not found");

    const rows = await sheet.getRows();
    const row = rows.find(r => String(r.get("ID")).trim() === String(id).trim());
    if (!row) throw new Error("Member not found");

    await row.delete();
    revalidatePath("/members");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete member:", error);
    return { success: false, error: error.message };
  }
}
