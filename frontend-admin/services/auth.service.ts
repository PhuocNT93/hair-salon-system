import api from "@/lib/api";

const login = (username: string, password: string) => {
    return api
        .post("/auth/signin", {
            username,
            password,
        })
        .then((response) => {
            // Check roles
            if (!response.data.roles.includes("ADMIN") && !response.data.roles.includes("STAFF")) {
                throw new Error("Unauthorized Access");
            }
            if (response.data.token) {
                localStorage.setItem("admin_user", JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("admin_user");
};

const getCurrentUser = () => {
    if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("admin_user");
        if (userStr) return JSON.parse(userStr);
    }
    return null;
};

const AuthService = {
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
