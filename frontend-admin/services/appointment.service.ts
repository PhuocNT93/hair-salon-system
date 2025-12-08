import api from "@/lib/api";

export interface Appointment {
    id: number;
    customerId: number;
    serviceId: number;
    staffId?: number;
    customerName?: string;
    serviceName?: string;
    staffName?: string;
    appointmentTime: string;
    status: string;
    customer?: any;
    service?: any;
    staff?: any;
}

const getAllAppointments = async (): Promise<Appointment[]> => {
    const response = await api.get("/appointments");
    return response.data;
};

const createAppointment = async (appointmentData: {
    customerId: number;
    serviceId: number;
    staffId?: number;
    appointmentTime: string;
}): Promise<Appointment> => {
    const response = await api.post("/appointments", null, {
        params: appointmentData
    });
    return response.data;
};

const updateAppointmentStatus = async (id: number, status: string): Promise<Appointment> => {
    const response = await api.put(`/appointments/${id}/status`, null, {
        params: { status }
    });
    return response.data;
};

const AppointmentService = {
    getAllAppointments,
    createAppointment,
    updateAppointmentStatus
};

export default AppointmentService;
