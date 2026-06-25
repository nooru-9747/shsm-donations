import { getMember } from "@/app/actions/members";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Phone, MapPin, Calendar, IndianRupee, FileText } from "lucide-react";
import MemberActions from "./MemberActions";

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMember(id);

  if (!member) {
    notFound();
  }

  const details = [
    { label: "Serial Number", value: `#${member.serialNumber}`, icon: User },
    { label: "Mobile Number", value: member.mobileNumber, icon: Phone },
    { label: "Address", value: member.address || "—", icon: MapPin },
    { label: "Join Date", value: member.joinDate, icon: Calendar },
    { label: "Monthly Amount", value: `₹${member.monthlyAmount}`, icon: IndianRupee },
    { label: "Notes", value: member.notes || "—", icon: FileText },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/members"
          className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Member Profile</h1>
          <p className="mt-1 text-sm text-emerald-600">View and manage member details.</p>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-emerald-700 rounded-xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{member.name}</h2>
            <span className={`inline-flex items-center mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              member.status === "ACTIVE"
                ? "bg-emerald-500/30 text-emerald-100 ring-1 ring-emerald-300/50"
                : "bg-red-400/30 text-red-100 ring-1 ring-red-300/50"
            }`}>
              {member.status}
            </span>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white shadow-sm border border-emerald-100 rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-emerald-50 bg-emerald-50/50">
          <h3 className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">Member Information</h3>
        </div>
        <dl className="divide-y divide-emerald-50">
          {details.map((detail) => {
            const Icon = detail.icon;
            return (
              <div key={detail.label} className="px-6 py-4 flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide">{detail.label}</dt>
                  <dd className="mt-0.5 text-sm text-slate-900 font-medium">{detail.value}</dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>

      {/* Actions */}
      <div className="bg-white shadow-sm border border-emerald-100 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Actions</h3>
        <MemberActions id={member.id} />
      </div>
    </div>
  );
}
