"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/members", icon: Users },
    { name: "Collections", href: "/collections", icon: CreditCard },
  ];

  if (isAdmin) {
    navItems.push({ name: "Reports", href: "/reports", icon: BarChart });
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-emerald-100 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">SD</span>
          </div>
          <span className="font-bold text-emerald-900">SHSM</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-emerald-600">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-emerald-900 text-white transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:w-64 lg:flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-center h-16 border-b border-emerald-800 hidden lg:flex">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-900">SD</span>
            </div>
            <span className="text-xl font-bold tracking-wider">SHSM</span>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto py-4 mt-16 lg:mt-0">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? "bg-emerald-800 text-white" 
                      : "text-emerald-100 hover:bg-emerald-800 hover:text-white"}
                  `}
                >
                  <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? "text-emerald-300" : "text-emerald-300 group-hover:text-white"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-emerald-800 p-4">
          <div className="flex items-center w-full">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">{session?.user?.name || "User"}</p>
              <p className="text-xs font-medium text-emerald-300 capitalize">
                {(session?.user as any)?.role?.toLowerCase()}
              </p>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
