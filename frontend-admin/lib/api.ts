const { token } = JSON.parse(admin);
if (token) {
    config.headers.Authorization = `Bearer ${token}`;
}
        }
return config;
    },
(error) => Promise.reject(error)
);

export default api;
