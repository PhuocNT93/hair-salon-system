import api from "@/lib/api";

const getAllServices = () => {
    return api.get("/services").then(res => res.data);
};

const bookAppointment = (customerId: number, serviceId: number, bookingTime: string) => {
    // Matches Backend: POST /api/appointments?customerId=X&serviceId=Y 
    // Body: { "bookingTime": "..." }
    return api.post(`/appointments?customerId=${customerId}&serviceId=${serviceId}`, {
        bookingTime: bookingTime
    }).then(res => res.data);
};

const getMyAppointments = (userId: number) => {
    return api.get(`/appointments/my-history?userId=${userId}`).then(res => res.data);
};

const DataService = {
    getAllServices,
    bookAppointment,
    getMyAppointments
};

export default DataService;
