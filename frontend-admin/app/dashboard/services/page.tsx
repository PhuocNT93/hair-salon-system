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
    IconButton,
    Typography
} from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import ServiceService, { Service } from "@/services/service.service";

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        durationMinutes: ""
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const data = await ServiceService.getAllServices();
            setServices(data);
        } catch (error) {
            console.error("Failed to load services", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (service?: Service) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                description: service.description || "",
                price: service.price.toString(),
                durationMinutes: service.durationMinutes.toString()
            });
        } else {
            setEditingService(null);
            setFormData({ name: "", description: "", price: "", durationMinutes: "" });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingService(null);
        setFormData({ name: "", description: "", price: "", durationMinutes: "" });
    };

    const handleSave = async () => {
        try {
            const serviceData = {
                ...formData,
                price: parseFloat(formData.price),
                durationMinutes: parseInt(formData.durationMinutes)
            };

            if (editingService) {
                await ServiceService.updateService(editingService.id, serviceData);
            } else {
                await ServiceService.createService(serviceData);
            }

            handleCloseDialog();
            loadServices();
        } catch (error) {
            console.error("Failed to save service", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this service?")) {
            try {
                await ServiceService.deleteService(id);
                loadServices();
            } catch (error) {
                console.error("Failed to delete service", error);
            }
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Service Name", flex: 1, minWidth: 200 },
        { field: "description", headerName: "Description", flex: 1, minWidth: 250 },
        {
            field: "price",
            headerName: "Price",
            width: 120,
            valueFormatter: (value) => `$${value}`
        },
        {
            field: "durationMinutes",
            headerName: "Duration",
            width: 120,
            valueFormatter: (value) => `${value} min`
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    key="edit"
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => handleOpenDialog(params.row)}
                />,
                <GridActionsCellItem
                    key="delete"
                    icon={<Delete />}
                    label="Delete"
                    onClick={() => handleDelete(params.row.id)}
                />
            ]
        }
    ];

    return (
        <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Services Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Service
                </Button>
            </Box>

            <DataGrid
                rows={services}
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
                <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <TextField
                            label="Service Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="Price ($)"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Duration (minutes)"
                            type="number"
                            value={formData.durationMinutes}
                            onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        {editingService ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
