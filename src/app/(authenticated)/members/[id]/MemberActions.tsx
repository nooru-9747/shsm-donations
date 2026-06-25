"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMember } from "@/app/actions/members";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";

export default function MemberActions({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this member? This action cannot be undone.")) {
      setIsDeleting(true);
      const result = await deleteMember(id);
      if (result.success) {
        router.push("/members");
        router.refresh();
      } else {
        alert(result.error || "Failed to delete member");
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/members/${id}/edit`}
        className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50 transition-colors"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
