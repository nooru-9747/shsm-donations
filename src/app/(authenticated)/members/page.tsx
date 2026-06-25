import { getMembers } from "@/app/actions/members";
import Link from "next/link";
import { Plus, Search, Eye, Edit } from "lucide-react";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Members</h1>
          <p className="mt-1 text-sm text-emerald-600">
            A list of all members and their donation details.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/members/new"
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Member
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-emerald-100 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-emerald-100 flex gap-4 bg-emerald-50/50">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-emerald-200 placeholder:text-emerald-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
              placeholder="Search members by name or serial..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-100">
            <thead className="bg-emerald-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-emerald-900 sm:pl-6">
                  Serial
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-emerald-900">
                  Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-emerald-900">
                  Mobile
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-emerald-900">
                  Amount
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-emerald-900">
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-emerald-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 bg-white">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-emerald-500">
                    No members found. Click "Add Member" to get started.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-emerald-900 sm:pl-6">
                      #{member.serialNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700 font-medium">
                      {member.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                      {member.mobileNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                      ₹{member.monthlyAmount}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        member.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : 'bg-red-50 text-red-700 ring-red-600/20'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/members/${member.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Link>
                        <Link
                          href={`/members/${member.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
