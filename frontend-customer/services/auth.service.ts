import api from "@/lib/api";

const register = (username: string, email: string, password: string, fullName: string, phone: string) => {
    return api.post("/auth/signup", {
        username,
        email,
        password,
        fullName,
        phone,
        role: ["user"],
    });
};

const login = (username: string, password: string) => {
    return api
        .post("/auth/signin", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);
    }
    return null;
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
