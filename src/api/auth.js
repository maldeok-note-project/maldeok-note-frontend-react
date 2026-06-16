import apiClient from "./client";

// ログアウトAPI
export const logout = () => {
  return apiClient.post("/logout");
};
