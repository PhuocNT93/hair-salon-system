import api from "@/lib/api";

export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
}

const getAllServices = async (): Promise<Service[]> => {
    const response = await api.get("/services");
    return response.data;
};

const createService = async (service: Omit<Service, "id">): Promise<Service> => {
    const response = await api.post("/services", service);
    return response.data;
};

const updateService = async (id: number, service: Partial<Omit<Service, "id">>): Promise<Service> => {
    const response = await api.put(`/services/${id}`, service);
    return response.data;
};

const deleteService = async (id: number): Promise<void> => {
    await api.delete(`/services/${id}`);
};

const ServiceService = {
    getAllServices,
    createService,
    updateService,
    deleteService
};

export default ServiceService;
