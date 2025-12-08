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
import { Add, Edit } from "@mui/icons-material";
import PaymentService, { Payment } from "@/services/payment.service";
import AppointmentService from "@/services/appointment.service";

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        appointmentId: "",
        amount: "",
        paymentMethod: "CASH",
        status: "PENDING"
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [pmts, appts] = await Promise.all([
                PaymentService.getAllPayments(),
                AppointmentService.getAllAppointments()
            ]);

            setPayments(pmts);
            setAppointments(appts);
        } catch (error) {
            console.error("Failed to load payments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setFormData({ appointmentId: "", amount: "", paymentMethod: "CASH", status: "PENDING" });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSave = async () => {
        try {
            await PaymentService.createPayment({
                appointmentId: parseInt(formData.appointmentId),
                amount: parseFloat(formData.amount),
                paymentMethod: formData.paymentMethod,
                status: formData.status
            });

            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error("Failed to create payment", error);
            alert("Failed to create payment");
        }
    };

    const handleUpdateStatus = async (id: number) => {
        const newStatus = prompt("Enter new status (PENDING/PAID/REFUNDED):");
        if (newStatus) {
            try {
                await PaymentService.updatePaymentStatus(id, newStatus);
                loadData();
            } catch (error) {
                console.error("Failed to update status", error);
            }
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "appointmentId",
            headerName: "Appointment",
            flex: 1,
            minWidth: 150,
            valueGetter: (value) => `Appointment #${value}`
        },
        {
            field: "amount",
            headerName: "Amount",
            width: 120,
            valueFormatter: (value) => `$${value}`
        },
        { field: "paymentMethod", headerName: "Method", width: 150 },
        {
            field: "status",
            headerName: "Status",
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === "PAID" ? "success" :
                            params.value === "REFUNDED" ? "error" :
                                "warning"
                    }
                    size="small"
                />
            )
        },
        {
            field: "createdAt",
            headerName: "Date",
            width: 180,
            valueFormatter: (value) => value ? new Date(value).toLocaleString() : "N/A"
        },
        { field: "transactionId", headerName: "Transaction ID", flex: 1, minWidth: 150 },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    key="edit"
                    icon={<Edit />}
                    label="Update Status"
                    onClick={() => handleUpdateStatus(params.row.id)}
                />
            ]
        }
    ];

    return (
        <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Payments Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenDialog}
                >
                    Add Payment
                </Button>
            </Box>

            <DataGrid
                rows={payments}
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

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Payment</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Appointment</InputLabel>
                            <Select
                                value={formData.appointmentId}
                                onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                                label="Appointment"
                            >
                                {appointments.map(a => (
                                    <MenuItem key={a.id} value={a.id}>
                                        Appointment #{a.id} - {new Date(a.appointmentTime).toLocaleDateString()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Amount ($)"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                label="Payment Method"
                            >
                                <MenuItem value="CASH">Cash</MenuItem>
                                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                                <MenuItem value="VNPAY">VNPay</MenuItem>
                                <MenuItem value="MOMO">MoMo</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                label="Status"
                            >
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="PAID">Paid</MenuItem>
                                <MenuItem value="REFUNDED">Refunded</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
