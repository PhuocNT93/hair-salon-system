"use client";

import { useEffect, useState } from "react";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, CreditCard, Activity, Calendar } from "lucide-react";
import AppointmentService, { Appointment } from "@/services/appointment.service";
import PaymentService, { Payment } from "@/services/payment.service";
import UserService, { User } from "@/services/user.service";
import ServiceService, { Service } from "@/services/service.service";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalAppointments: 0,
        totalSales: 0,
        activeServices: 0,
        totalCustomers: 0,
        totalStaff: 0
    });
    const [recentSales, setRecentSales] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointments, payments, users, services] = await Promise.all([
                    AppointmentService.getAllAppointments(),
                    PaymentService.getAllPayments(),
                    UserService.getAllUsers(),
                    ServiceService.getAllServices()
                ]);

                const revenue = payments.reduce((sum, p) => sum + p.amount, 0);
                const customers = users.filter(u => u.role === 'CUSTOMER').length;
                const staff = users.filter(u => u.role === 'STAFF').length;

                // Sort payments by date desc for recent sales (mocking date logic if string format is simple, otherwise just taking last few)
                // Assuming ID order roughly correlates to time for now or just slice
                const sortedPayments = [...payments].sort((a, b) => b.id - a.id).slice(0, 5);

                setStats({
                    totalRevenue: revenue,
                    totalAppointments: appointments.length,
                    totalSales: payments.length,
                    activeServices: services.length,
                    totalCustomers: customers,
                    totalStaff: staff
                });
                setRecentSales(sortedPayments);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime revenue</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                        <p className="text-xs text-muted-foreground">Total bookings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Services</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeServices}</div>
                        <p className="text-xs text-muted-foreground">Available services</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <p className="text-sm text-muted-foreground">Latest {recentSales.length} transactions.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentSales.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No recent sales found.</p>
                            ) : (
                                recentSales.map((payment) => (
                                    <div key={payment.id} className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-bold">
                                            $
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Payment #{payment.id}</p>
                                            <p className="text-sm text-muted-foreground">{payment.paymentMethod}</p>
                                        </div>
                                        <div className="ml-auto font-medium">+${payment.amount}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
