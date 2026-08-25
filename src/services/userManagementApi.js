import { apiRequest } from "./api";

export const getUsers = () =>
  apiRequest(
    "/user-management",
    "GET"
  );

export const approveUser = (id) =>
  apiRequest(
    `/user-management/${id}/approve`,
    "PUT"
  );

export const rejectUser = (id) =>
  apiRequest(
    `/user-management/${id}/reject`,
    "PUT"
  );