import api from "@/lib/api";

export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "STAFF" | "CUSTOMER";
    phone?: string;
    address?: string;
}

const getAllUsers = async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
};

const createStaff = async (staffData: {
    username: string;
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string;
}): Promise<any> => {
    const response = await api.post("/users/staff", staffData);
    return response.data;
};

const updateUser = async (id: number, userData: Partial<Omit<User, "id" | "role">>): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

const UserService = {
    getAllUsers,
    createStaff,
    updateUser
};

export default UserService;
