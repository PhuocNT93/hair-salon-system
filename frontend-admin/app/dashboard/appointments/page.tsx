"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip
} from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Add, QrCode2, Edit } from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import AppointmentService, { Appointment } from "@/services/appointment.service";
import UserService from "@/services/user.service";
import ServiceService from "@/services/service.service";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openQRDialog, setOpenQRDialog] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [formData, setFormData] = useState({
        customerId: "",
        serviceId: "",
        staffId: "",
        appointmentTime: "",
        status: "PENDING"
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [appts, users, svcs] = await Promise.all([
                AppointmentService.getAllAppointments(),
                UserService.getAllUsers(),
                ServiceService.getAllServices()
            ]);

            setAppointments(appts);
            setCustomers(users.filter(u => u.role === "CUSTOMER"));
            setStaff(users.filter(u => u.role === "STAFF"));
            setServices(svcs);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setFormData({ customerId: "", serviceId: "", staffId: "", appointmentTime: "", status: "PENDING" });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSave = async () => {
        try {
            await AppointmentService.createAppointment({
                customerId: parseInt(formData.customerId),
                serviceId: parseInt(formData.serviceId),
                staffId: formData.staffId ? parseInt(formData.staffId) : undefined,
                appointmentTime: formData.appointmentTime
            });

            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error("Failed to create appointment", error);
            alert("Failed to create appointment");
        }
    };

    const handleShowQR = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setOpenQRDialog(true);
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            await AppointmentService.updateAppointmentStatus(id, newStatus);
            loadData();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const getQRData = (appointment: Appointment) => {
        return JSON.stringify({
            id: appointment.id,
            customerId: appointment.customerId,
            serviceId: appointment.serviceId,
            appointmentTime: appointment.appointmentTime,
            status: appointment.status
        });
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "customerId",
            headerName: "Customer",
            flex: 1,
            minWidth: 150,
            valueGetter: (value, row) => {
                const customer = customers.find(c => c.id === row.customerId);
                return customer?.fullName || `Customer #${row.customerId}`;
            }
        },
        {
            field: "serviceId",
            headerName: "Service",
            flex: 1,
            minWidth: 150,
            valueGetter: (value, row) => {
                const service = services.find(s => s.id === row.serviceId);
                return service?.name || `Service #${row.serviceId}`;
            }
        },
        {
            field: "staffId",
            headerName: "Staff",
            flex: 1,
            minWidth: 150,
            valueGetter: (value, row) => {
                if (!row.staffId) return "Not assigned";
                const staffMember = staff.find(s => s.id === row.staffId);
                return staffMember?.fullName || `Staff #${row.staffId}`;
            }
        },
        {
            field: "appointmentTime",
            headerName: "Time",
            width: 180,
            valueFormatter: (value) => new Date(value).toLocaleString()
        },
        {
            field: "status",
            headerName: "Status",
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === "COMPLETED" ? "success" :
                            params.value === "CANCELLED" ? "error" :
                                "warning"
                    }
                    size="small"
                />
            )
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 120,
            getActions: (params) => [
                <GridActionsCellItem
                    key="qr"
                    icon={<QrCode2 />}
                    label="QR Code"
                    onClick={() => handleShowQR(params.row)}
                />,
                <GridActionsCellItem
                    key="edit"
                    icon={<Edit />}
                    label="Update Status"
                    onClick={() => {
                        const newStatus = prompt("Enter new status (PENDING/CONFIRMED/COMPLETED/CANCELLED):");
                        if (newStatus) handleUpdateStatus(params.row.id, newStatus);
                    }}
                />
            ]
        }
    ];

    return (
        <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Appointments Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenDialog}
                >
                    New Appointment
                </Button>
            </Box>

            <DataGrid
                rows={appointments}
                columns={columns}
                loading={loading}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } }
                }}
                disableRowSelectionOnClick
                sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    "& .MuiDataGrid-cell:focus": {
                        outline: "none"
                    }
                }}
            />

            {/* Create Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Appointment</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Customer</InputLabel>
                            <Select
                                value={formData.customerId}
                                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                label="Customer"
                            >
                                {customers.map(c => (
                                    <MenuItem key={c.id} value={c.id}>{c.fullName} ({c.username})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel>Service</InputLabel>
                            <Select
                                value={formData.serviceId}
                                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                label="Service"
                            >
                                {services.map(s => (
                                    <MenuItem key={s.id} value={s.id}>{s.name} (${s.price})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Staff (Optional)</InputLabel>
                            <Select
                                value={formData.staffId}
                                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                                label="Staff (Optional)"
                            >
                                <MenuItem value="">None</MenuItem>
                                {staff.map(s => (
                                    <MenuItem key={s.id} value={s.id}>{s.fullName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Appointment Time"
                            type="datetime-local"
                            value={formData.appointmentTime}
                            onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>

            {/* QR Code Dialog */}
            <Dialog open={openQRDialog} onClose={() => setOpenQRDialog(false)} maxWidth="sm">
                <DialogTitle>Appointment QR Code</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 2 }}>
                        {selectedAppointment && (
                            <>
                                <QRCodeCanvas
                                    value={getQRData(selectedAppointment)}
                                    size={300}
                                    level="H"
                                />
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Appointment ID: {selectedAppointment.id}<br />
                                    Scan this QR code to view appointment details
                                </Typography>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenQRDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
