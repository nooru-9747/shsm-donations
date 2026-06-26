"use client";
import { Printer } from "lucide-react";

export default function PrintTrigger() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 18px",
        background: "#065f46",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      <Printer size={16} />
      Print / Save as PDF
    </button>
  );
}
