import LoginForm from "@/components/auth/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">SD</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-900">
          SHSM Donations
        </h2>
        <p className="mt-2 text-center text-sm text-emerald-600">
          Madrasa Donation Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-emerald-100">
          <div className="mb-6 pb-6 border-b border-emerald-50 text-center">
            <h3 className="text-lg font-medium text-emerald-800">Welcome Back</h3>
            <p className="text-sm text-emerald-500 mt-1">Please sign in to your account</p>
          </div>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-emerald-500">
          &copy; {new Date().getFullYear()} SHSM. All rights reserved.
        </p>
      </div>
    </div>
  );
}
