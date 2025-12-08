import api from "@/lib/api";

export interface Payment {
    id: number;
    appointmentId: number;
    amount: number;
    paymentMethod: string;
    paymentTime: string;
    status: string;
    transactionId?: string;
    appointment?: any;
}

const getAllPayments = async (): Promise<Payment[]> => {
    const response = await api.get("/payments");
    return response.data;
};

const createPayment = async (paymentData: {
    appointmentId: number;
    amount: number;
    paymentMethod: string;
    status: string;
}): Promise<Payment> => {
    const response = await api.post("/payments", paymentData, {
        params: { appointmentId: paymentData.appointmentId }
    });
    return response.data;
};

const updatePaymentStatus = async (id: number, status: string, transactionId?: string): Promise<Payment> => {
    const response = await api.put(`/payments/${id}/status`, null, {
        params: { status, transactionId }
    });
    return response.data;
};

const PaymentService = {
    getAllPayments,
    createPayment,
    updatePaymentStatus
};

export default PaymentService;
