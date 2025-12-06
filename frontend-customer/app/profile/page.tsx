"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth.service";
import DataService from "@/services/data.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "lucide-react"; // Wait, Badge is a component, not icon. I need to make a Badge component or use text.
// Let's make a simple badge style.

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            router.push("/login");
            return;
        }
        setUser(currentUser);

        DataService.getMyAppointments(currentUser.id)
            .then(data => {
                setAppointments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [router]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "text-green-600 bg-green-100";
            case "PENDING": return "text-yellow-600 bg-yellow-100";
            case "CANCELLED": return "text-red-600 bg-red-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    if (!user) return null;

    return (
        <div className="container py-10 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{user.fullName}</h1>
                    <p className="text-gray-500">{user.email}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

            {loading ? <p>Loading history...</p> : (
                <div className="grid gap-4">
                    {appointments.length === 0 && <p>No appointments found.</p>}
                    {appointments.map((appt) => (
                        <Card key={appt.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle>{appt.service.name}</CardTitle>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(appt.status)}`}>
                                        {appt.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">Date: {new Date(appt.bookingTime).toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Price: ${appt.service.price}</p>
                                {appt.staff && <p className="text-sm text-gray-500">Stylist: {appt.staff.fullName}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
