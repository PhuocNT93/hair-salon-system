"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import UserService, { User } from "@/services/user.service";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const users = await UserService.getAllUsers();
            setCustomers(users.filter(u => u.role === "CUSTOMER"));
        } catch (error) {
            console.error("Failed to load customers", error);
        } finally {
            setLoading(false);
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "username", headerName: "Username", flex: 1, minWidth: 150 },
        { field: "fullName", headerName: "Full Name", flex: 1, minWidth: 200 },
        { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
        { field: "phone", headerName: "Phone", width: 150 },
        { field: "address", headerName: "Address", flex: 1, minWidth: 200 }
    ];

    return (
        <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Customers
                </Typography>
                <Chip label={`Total: ${customers.length}`} color="primary" />
            </Box>

            <DataGrid
                rows={customers}
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
        </Box>
    );
}
