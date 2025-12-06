"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, User, Calendar, Settings, LogOut, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthService from "@/services/auth.service";
import { useEffect, useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const user = AuthService.getCurrentUser();
        if (!user) {
            router.push("/login");
        }
    }, [router]);

    if (!mounted) return null;
    if (pathname === "/login") return <>{children}</>;

    const handleLogout = () => {
        AuthService.logout();
        router.push("/login");
    };

    const navItems = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
        { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
        { href: "/dashboard/staff", label: "Staff", icon: User },
        { href: "/dashboard/services", label: "Services", icon: Settings },
        { href: "/dashboard/customers", label: "Customers", icon: Users },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Salon Admin</h1>
                </div>
                <nav className="space-y-2 px-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-800",
                                pathname === item.href ? "bg-primary text-white" : "text-gray-400"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors mt-8"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
