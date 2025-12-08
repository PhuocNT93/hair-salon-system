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
    Typography
} from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Add, Edit } from "@mui/icons-material";
import UserService, { User } from "@/services/user.service";

export default function StaffPage() {
    const [staff, setStaff] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingStaff, setEditingStaff] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullName: "",
        phone: ""
    });

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        try {
            const users = await UserService.getAllUsers();
            setStaff(users.filter(u => u.role === "STAFF"));
        } catch (error) {
            console.error("Failed to load staff", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (staffMember?: User) => {
        if (staffMember) {
            setEditingStaff(staffMember);
            setFormData({
                username: staffMember.username,
                email: staffMember.email,
                password: "",
                fullName: staffMember.fullName,
                phone: staffMember.phone || ""
            });
        } else {
            setEditingStaff(null);
            setFormData({ username: "", email: "", password: "", fullName: "", phone: "" });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingStaff(null);
        setFormData({ username: "", email: "", password: "", fullName: "", phone: "" });
    };

    const handleSave = async () => {
        try {
            if (editingStaff) {
                await UserService.updateUser(editingStaff.id, {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email
                });
            } else {
                await UserService.createStaff({
                    username: formData.username,
                    email: formData.email,
                    passwordHash: formData.password,
                    fullName: formData.fullName,
                    phone: formData.phone
                });
            }

            handleCloseDialog();
            loadStaff();
        } catch (error) {
            console.error("Failed to save staff", error);
            alert("Failed to save staff member");
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "username", headerName: "Username", flex: 1, minWidth: 150 },
        { field: "fullName", headerName: "Full Name", flex: 1, minWidth: 200 },
        { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
        { field: "phone", headerName: "Phone", width: 150 },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    key="edit"
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => handleOpenDialog(params.row)}
                />
            ]
        }
    ];

    return (
        <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Staff Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Staff
                </Button>
            </Box>

            <DataGrid
                rows={staff}
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
                <DialogTitle>{editingStaff ? "Edit Staff" : "Add New Staff"}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <TextField
                            label="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            fullWidth
                            required
                            disabled={!!editingStaff}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            fullWidth
                            required
                        />
                        {!editingStaff && (
                            <TextField
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                fullWidth
                                required
                            />
                        )}
                        <TextField
                            label="Full Name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        {editingStaff ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
