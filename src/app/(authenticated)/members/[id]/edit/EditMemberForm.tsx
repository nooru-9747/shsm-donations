"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMember } from "@/app/actions/members";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

type Member = {
  id: string;
  serialNumber: string;
  name: string;
  address: string;
  mobileNumber: string;
  monthlyAmount: string;
  joinDate: string;
  status: string;
  notes: string;
};

export default function EditMemberForm({ member }: { member: Member }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await updateMember(member.id, formData);

    if (result.success) {
      router.push(`/members/${member.id}`);
      router.refresh();
    } else {
      setError(result.error || "Failed to update member");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href={`/members/${member.id}`}
          className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Edit Member</h1>
          <p className="mt-1 text-sm text-emerald-600">
            Update details for <span className="font-semibold">{member.name}</span>
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-emerald-100 rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-emerald-900">
                Full Name *
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  defaultValue={member.name}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-emerald-200 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium leading-6 text-emerald-900">
                Address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="address"
                  id="address"
                  defaultValue={member.address}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-emerald-200 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium leading-6 text-emerald-900">
                Mobile Number *
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  name="mobileNumber"
                  id="mobileNumber"
                  required
                  defaultValue={member.mobileNumber}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-emerald-200 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="monthlyAmount" className="block text-sm font-medium leading-6 text-emerald-900">
                Monthly Expected Amount (₹) *
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="monthlyAmount"
                  id="monthlyAmount"
                  required
                  min="0"
                  defaultValue={member.monthlyAmount}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-emerald-200 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-emerald-900">
                Status
              </label>
              <div className="mt-2">
                <select
                  name="status"
                  id="status"
                  defaultValue={member.status}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-emerald-200 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium leading-6 text-emerald-900">
                Notes
              </label>
              <div className="mt-2">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  defaultValue={member.notes}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-emerald-200 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-x-4 border-t border-emerald-100">
            <Link
              href={`/members/${member.id}`}
              className="text-sm font-semibold leading-6 text-emerald-700 hover:text-emerald-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
