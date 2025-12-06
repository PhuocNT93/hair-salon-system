"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Payment {
    id: number;
    amount: number;
    paymentMethod: string;
    status: string;
    transactionId: string;
    appointment: {
        customer: { fullName: string };
        service: { name: string };
    };
    createdAt: string;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        api.get("/payments").then((res) => setPayments(res.data));
    }, []);

    const updateStatus = async (id: number, status: string) => {
        await api.put(`/payments/${id}/status?status=${status}`).then((res) => {
            setPayments(payments.map(p => p.id === id ? res.data : p));
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Payment Management</h1>
            <div className="grid gap-4">
                {payments.length === 0 && <p>No payments recorded.</p>}
                {payments.map(payment => (
                    <Card key={payment.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Invoice #{payment.id} - {payment.appointment.customer?.fullName}
                            </CardTitle>
                            <span className={`text-xs px-2 py-1 rounded font-bold ${payment.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {payment.status}
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mt-2">
                                <div>
                                    <div className="text-2xl font-bold">${payment.amount}</div>
                                    <p className="text-xs text-secondary-foreground">
                                        {payment.paymentMethod} • {payment.appointment.service.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="space-x-2">
                                    {payment.status === 'PENDING' && (
                                        <Button size="sm" onClick={() => updateStatus(payment.id, 'PAID')}>Mark Paid</Button>
                                    )}
                                    <Button variant="outline" size="sm">Refund</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
