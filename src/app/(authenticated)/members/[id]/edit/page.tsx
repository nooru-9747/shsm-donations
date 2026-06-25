import { getMember } from "@/app/actions/members";
import { notFound } from "next/navigation";
import EditMemberForm from "./EditMemberForm";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMember(id);

  if (!member) {
    notFound();
  }

  return <EditMemberForm member={member} />;
}
