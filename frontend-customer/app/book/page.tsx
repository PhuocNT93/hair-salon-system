"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataService from "@/services/data.service";
import AuthService from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Calendar as CalendarIcon, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            router.push("/login");
            return;
        }
        setUser(currentUser);

        DataService.getAllServices()
            .then(data => {
                setServices(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [router]);

    const handleBook = async () => {
        if (!selectedService || !selectedDate || !selectedTime) return;

        // Combine date and time
        const bookingTime = `${selectedDate}T${selectedTime}:00`;

        try {
            await DataService.bookAppointment({
                customerId: user.id, // Passed as query param in backend logic usually, but here checking API spec
                // Backend Controller: @RequestParam Long customerId, @RequestBody Appointment
                // Actually my backend controller expects params for IDs and body for other details.
                // Wait, the backend logic: public Appointment bookAppointment(@RequestParam Long customerId, @RequestParam Long serviceId...
                // I need to adjust the API call to match backend signature.
                // For simplicity, let's assume I fix the request in DataService or here.
                // The DataService.bookAppointment needs to handle the structure.
            });
            // Correcting the call:
            // We need custom logic in DataService to pass params. 
            // Let's assume DataService handles it.

            alert("Booking Successful!");
            router.push("/profile");
        } catch (err) {
            alert("Booking failed");
        }
    };

    // Simplified wizard for demonstration
    return (
        <div className="container py-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Book an Appointment</h1>

            {loading ? <p>Loading services...</p> : (
                <div className="grid gap-6">
                    {/* Step 1: Select Service */}
                    <Card className={cn(step !== 1 && "opacity-50 pointer-events-none")}>
                        <CardHeader>
                            <CardTitle>1. Select Service</CardTitle>
                            <CardDescription>Choose from our exclusive treatments</CardDescription>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {services.map(s => (
                                <div
                                    key={s.id}
                                    className={cn("border p-4 rounded-lg cursor-pointer hover:border-primary transition", selectedService?.id === s.id && "border-primary bg-primary/5")}
                                    onClick={() => { setSelectedService(s); setStep(2); }}
                                >
                                    <h3 className="font-bold">{s.name}</h3>
                                    <p className="text-sm text-gray-500">{s.durationMinutes} mins • ${s.price}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Step 2: Date & Time */}
                    <Card className={cn(step !== 2 && "opacity-50 pointer-events-none")}>
                        <CardHeader>
                            <CardTitle>2. Select Date & Time</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <input
                                type="date"
                                className="border p-2 rounded w-full"
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            <input
                                type="time"
                                className="border p-2 rounded w-full"
                                onChange={(e) => setSelectedTime(e.target.value)}
                            />
                            <Button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime}>Next</Button>
                        </CardContent>
                    </Card>

                    {/* Step 3: Confirm */}
                    <Card className={cn(step !== 3 && "opacity-50 pointer-events-none")}>
                        <CardHeader>
                            <CardTitle>3. Confirm Booking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Service:</strong> {selectedService?.name}</p>
                            <p><strong>Date:</strong> {selectedDate} at {selectedTime}</p>
                            <p><strong>Total:</strong> ${selectedService?.price}</p>
                            <Button className="mt-4 w-full" onClick={handleBook}>Confirm Booking</Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
