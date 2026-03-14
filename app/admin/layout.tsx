"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { LayoutDashboard, MapPin, Video, LogOut, Menu } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  { label: "Locations", href: "/admin/locations", icon: <MapPin size={18} /> },
  { label: "Media", href: "/admin/media", icon: <Video size={18} /> },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-slate-900 select-none">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-white font-bold text-lg">YouSafe</h1>
        <p className="text-slate-400 text-xs mt-0.5">Admin Panel</p>
      </div>

      <Separator className="bg-slate-700" />

      {/* Nav Items */}
      <nav className="p-4 flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${
                pathname === item.href
                  ? "bg-teal-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }
            `}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <Separator className="bg-slate-700" />

      {/* Sign Out */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-10 select-none">
          {/* Mobile Menu */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu size={22} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-64 bg-slate-900 border-slate-700"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SidebarContent onNavigate={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>

          <h2 className="text-slate-800 font-semibold text-sm sm:text-base">
            {navItems.find((item) => item.href === pathname)?.label ?? "Admin"}
          </h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
