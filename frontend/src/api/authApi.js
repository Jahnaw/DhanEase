import axiosClient from "./axiosClient";

export const signup = (payload) => axiosClient.post("/api/auth/signup", payload);
export const login = (payload) => axiosClient.post("/api/auth/login", payload);
export const getMe = () => axiosClient.get("/api/auth/me");
export const updateProfile = (payload) =>
  axiosClient.patch("/api/auth/me", payload);

export const uploadAvatar = (formData) =>
  axiosClient.post("/api/auth/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });