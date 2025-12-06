"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StaffPage() {
    const [staff, setStaff] = useState<any[]>([]);
    // Mock user list endpoint because backend only has getAllUsers (which returns all). 
    // We will filter client side or assume backend improvement.

    useEffect(() => {
        api.get("/users").then((res) => {
            setStaff(res.data.filter((u: any) => u.role === 'STAFF'));
        });
    }, []);

    // Simplified creation (username/password usually needed separate registration flow or admin created)
    // Using simple placeholder form
    const [isCreating, setIsCreating] = useState(false);
    const [newStaff, setNewStaff] = useState({ username: "", password: "", fullName: "", email: "" });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.post("/users/staff", newStaff); // Endpoint created in Step 74
        setIsCreating(false);
        // Refresh
        api.get("/users").then((res) => setStaff(res.data.filter((u: any) => u.role === 'STAFF')));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Staff Management</h1>
                <Button onClick={() => setIsCreating(!isCreating)}>Add Staff</Button>
            </div>

            {isCreating && (
                <Card>
                    <CardHeader><CardTitle>New Staff Member</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Username</Label><Input value={newStaff.username} onChange={e => setNewStaff({ ...newStaff, username: e.target.value })} required /></div>
                                <div><Label>Email</Label><Input type="email" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} required /></div>
                                <div><Label>Full Name</Label><Input value={newStaff.fullName} onChange={e => setNewStaff({ ...newStaff, fullName: e.target.value })} required /></div>
                                <div><Label>Password</Label><Input type="password" value={newStaff.password} onChange={e => setNewStaff({ ...newStaff, password: e.target.value })} required /></div>
                            </div>
                            <Button type="submit">Create Account</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {staff.map(s => (
                    <Card key={s.id}>
                        <CardHeader>
                            <CardTitle>{s.fullName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{s.email}</p>
                            <p className="text-sm text-gray-500">@{s.username}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
