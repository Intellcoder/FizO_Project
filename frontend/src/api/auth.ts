import api from "./axiosInstance";

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
}
