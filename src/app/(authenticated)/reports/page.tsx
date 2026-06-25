import { getMemberBalances } from "@/app/actions/collections";
import { Download } from "lucide-react";

export default async function ReportsPage() {
  const balances = await getMemberBalances();
  
  const totalExpected = balances.reduce((sum, b) => sum + b.totalExpected, 0);
  const totalCollected = balances.reduce((sum, b) => sum + b.totalPaid, 0);
  const totalOutstanding = balances.reduce((sum, b) => sum + b.outstanding, 0);

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Financial Reports</h1>
          <p className="mt-1 text-sm text-emerald-600">
            View detailed financial summaries and export data.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm ring-1 ring-emerald-200 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            <Download className="-ml-1 mr-2 h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-emerald-100 rounded-xl overflow-hidden mb-8">
        <div className="p-6 border-b border-emerald-100 bg-emerald-50">
          <h3 className="text-lg font-medium text-emerald-900">Overall Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-emerald-100">
          <div className="p-6">
            <p className="text-sm font-medium text-slate-500">Total Expected</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              <span className="text-4xl font-semibold tracking-tight text-slate-900">₹{totalExpected}</span>
            </p>
          </div>
          <div className="p-6">
            <p className="text-sm font-medium text-slate-500">Total Collected</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              <span className="text-4xl font-semibold tracking-tight text-emerald-600">₹{totalCollected}</span>
            </p>
          </div>
          <div className="p-6">
            <p className="text-sm font-medium text-slate-500">Total Outstanding</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              <span className="text-4xl font-semibold tracking-tight text-red-600">₹{totalOutstanding}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-emerald-100 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-emerald-100">
          <h3 className="text-lg font-medium text-emerald-900">Detailed Member Report</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-100">
            <thead className="bg-emerald-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-emerald-900">Member</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-emerald-900">Expected</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-emerald-900">Collected</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-emerald-900">Advance</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-emerald-900">Dues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 bg-white">
              {balances.map((member) => (
                <tr key={member.id} className="hover:bg-emerald-50/50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-emerald-900">
                    {member.name}
                    <div className="text-xs text-slate-400 font-normal">#{member.serialNumber}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 text-right">
                    ₹{member.totalExpected}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-emerald-600 font-medium text-right">
                    ₹{member.totalPaid}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-emerald-600 text-right">
                    {member.advance > 0 ? `₹${member.advance}` : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-red-600 text-right">
                    {member.outstanding > 0 ? `₹${member.outstanding}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
