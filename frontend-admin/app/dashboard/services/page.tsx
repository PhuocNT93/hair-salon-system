"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newService, setNewService] = useState({ name: "", price: "", durationMinutes: "" });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = () => {
        api.get("/services").then((res) => setServices(res.data));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.post("/services", { ...newService, price: parseFloat(newService.price), durationMinutes: parseInt(newService.durationMinutes) });
        setIsCreating(false);
        setNewService({ name: "", price: "", durationMinutes: "" });
        loadServices();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure?")) {
            await api.delete(`/services/${id}`);
            loadServices();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Services</h1>
                <Button onClick={() => setIsCreating(!isCreating)}>{isCreating ? "Cancel" : "Add Service"}</Button>
            </div>

            {isCreating && (
                <Card>
                    <CardHeader><CardTitle>New Service</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div><Label>Name</Label><Input value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Price ($)</Label><Input type="number" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} required /></div>
                                <div><Label>Duration (min)</Label><Input type="number" value={newService.durationMinutes} onChange={e => setNewService({ ...newService, durationMinutes: e.target.value })} required /></div>
                            </div>
                            <Button type="submit">Save</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map(s => (
                    <Card key={s.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between">
                                <CardTitle>{s.name}</CardTitle>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)}>Delete</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${s.price}</div>
                            <p className="text-sm text-gray-500">{s.durationMinutes} mins</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
