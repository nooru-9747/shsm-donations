import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Completely bare layout — no sidebar, no nav. Used for print pages only.
export default async function PrintRootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#f1f5f9" }}>
        {children}
      </body>
    </html>
  );
}
