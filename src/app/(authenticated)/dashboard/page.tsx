import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Users, CreditCard, AlertCircle, TrendingUp } from "lucide-react";
import { getDashboardStats } from "@/app/actions/dashboard";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { getMemberBalances } from "@/app/actions/collections";
import ExportReportCard from "@/components/dashboard/ExportReportCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  const statsData = await getDashboardStats();
  const balances = await getMemberBalances();

  const totalOutstanding = balances.reduce((sum, b) => sum + b.outstanding, 0);
  
  const stats = [
    { name: "Total Members", stat: statsData?.totalMembers || 0, icon: Users, color: "bg-blue-500" },
    { name: "Monthly Expected", stat: `₹${statsData?.monthlyExpected || 0}`, icon: TrendingUp, color: "bg-emerald-500" },
    { name: "Collected This Month", stat: `₹${statsData?.collectedThisMonth || 0}`, icon: CreditCard, color: "bg-emerald-600" },
    { name: "Total Outstanding", stat: `₹${totalOutstanding}`, icon: AlertCircle, color: "bg-red-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-emerald-900">Dashboard</h1>
        <p className="mt-1 text-sm text-emerald-600">
          Welcome back, {session?.user?.name || "Admin"}. Here is what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-xl bg-white px-4 pt-5 pb-12 shadow-sm border border-emerald-100 sm:px-6 sm:pt-6 hover:shadow-md transition-shadow"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${item.color}`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-slate-500">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-slate-900">{item.stat}</p>
              </dd>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white shadow-sm border border-emerald-100 rounded-xl p-6 h-96 col-span-2">
          <h3 className="text-lg font-medium text-emerald-900 mb-4">Collection Trends</h3>
          {statsData?.chartData ? (
            <DashboardCharts data={statsData.chartData} />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              No chart data available
            </div>
          )}
        </div>

        <div className="bg-white shadow-sm border border-emerald-100 rounded-xl p-6">
          <h3 className="text-lg font-medium text-emerald-900 mb-4">Top Defaulters</h3>
          <div className="space-y-4">
            {balances
              .filter(b => b.outstanding > 0)
              .sort((a, b) => b.outstanding - a.outstanding)
              .slice(0, 5)
              .map(member => (
                <div key={member.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">#{member.serialNumber}</p>
                  </div>
                  <span className="text-sm font-bold text-red-600">₹{member.outstanding}</span>
                </div>
              ))}
            {balances.filter(b => b.outstanding > 0).length === 0 && (
              <p className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg text-center">
                All members are up to date! 🎉
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Export card always below on all screen sizes */}
      <div className="mt-8">
        <ExportReportCard />
      </div>
    </div>
  );
}
