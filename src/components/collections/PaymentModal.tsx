"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { markPayment } from "@/app/actions/collections";
import { useRouter } from "next/navigation";

type PaymentModalProps = {
  member: {
    id: string;
    name: string;
    outstanding: number;
    advance: number;
    monthlyAmount: number;
  };
  onClose: () => void;
};

export default function PaymentModal({ member, onClose }: PaymentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Default amount: if they have dues, suggest paying dues. Otherwise, suggest their monthly amount.
  const defaultAmount = member.outstanding > 0 ? member.outstanding : member.monthlyAmount;
  const [amount, setAmount] = useState(defaultAmount.toString());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("memberId", member.id);
    formData.append("amount", amount);
    formData.append("expected", member.outstanding.toString());
    formData.append("remarks", "Collected via web");

    const result = await markPayment(formData);
    
    if (result.success) {
      router.refresh();
      onClose();
    } else {
      alert("Failed to mark payment: " + result.error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-emerald-100 bg-emerald-50">
          <h3 className="text-lg font-semibold text-emerald-900">Collect Payment</h3>
          <button onClick={onClose} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <p className="text-sm text-slate-500">Member</p>
            <p className="font-medium text-slate-900">{member.name}</p>
          </div>
          
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div>
              <p className="text-sm text-slate-500">Current Dues</p>
              <p className="font-semibold text-red-600">₹{member.outstanding}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Current Advance</p>
              <p className="font-semibold text-emerald-600">₹{member.advance}</p>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-emerald-900 mb-1">
              Amount Paying Now (₹)
            </label>
            <input
              type="number"
              id="amount"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-emerald-200 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
              placeholder="Enter amount..."
            />
            <p className="mt-1 text-xs text-slate-500">
              Any amount paid above the current dues will be automatically saved as an Advance.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-emerald-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || Number(amount) <= 0}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
