"use client";

import { useState } from "react";
import { Search, IndianRupee } from "lucide-react";
import PaymentModal from "./PaymentModal";

type MemberBalance = {
  id: string;
  name: string;
  serialNumber: string;
  mobileNumber: string;
  monthlyAmount: number;
  totalExpected: number;
  totalPaid: number;
  outstanding: number;
};

export default function CollectionsClient({ balances }: { balances: MemberBalance[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberBalance | null>(null);

  const filteredBalances = balances.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.serialNumber.includes(searchTerm)
  );

  return (
    <div>
      <div className="bg-white shadow-sm border border-emerald-100 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-emerald-100 flex gap-4 bg-emerald-50/50">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-emerald-200 placeholder:text-emerald-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
              placeholder="Search members to collect from..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-100">
            <thead className="bg-emerald-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-emerald-900">Serial</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-emerald-900">Name</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-emerald-900">Expected</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-emerald-900">Paid Total</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-red-700">Outstanding</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 bg-white">
              {filteredBalances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-emerald-500">
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredBalances.map((member) => (
                  <tr key={member.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-emerald-900">
                      #{member.serialNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                      {member.name}
                      <div className="text-xs text-slate-400">{member.mobileNumber}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                      ₹{member.totalExpected}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-emerald-600 font-medium">
                      ₹{member.totalPaid}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-red-600">
                      ₹{member.outstanding}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {member.outstanding > 0 ? (
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-200 transition-colors"
                        >
                          <IndianRupee className="w-4 h-4 mr-1" />
                          Collect
                        </button>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMember && (
        <PaymentModal 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)} 
        />
      )}
    </div>
  );
}
