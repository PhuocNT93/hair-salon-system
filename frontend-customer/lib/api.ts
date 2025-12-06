const { token } = JSON.parse(user);
if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Remove redundant "Bearer " if backend expects pure token, but usually it's "Bearer <token>"
    // Backend AuthTokenFilter.java expects "Bearer " prefix in headerAuth.startsWith("Bearer ")
    // Wait, the backend logic: return headerAuth.substring(7);
    // So I must send "Bearer <token>"
    // My code: `Bearer ${token}`. correct.
}
        }
return config;
    },
(error) => Promise.reject(error)
);

export default api;
