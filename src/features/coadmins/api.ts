import { secureApi } from "../../config/apiClient";
import { CoAdminApi } from "./types";

export const coAdminApi: CoAdminApi = {
  async list(input) {
    const { data } = await secureApi.get("/api/v1/admin/coadmins", { params: input });
    return { data: data.data, pagination: data.pagination };
  },
  async invite(input) {
    const { data } = await secureApi.post("/api/v1/admin/coadmins/invite", input);
    return data.data;
  },
  async resend(id) {
    const { data } = await secureApi.post(`/api/v1/admin/coadmins/${id}/invitation`);
    return data.data;
  },
  async setActive(id, active) {
    const { data } = await secureApi.patch(`/api/v1/admin/coadmins/${id}/status`, { active });
    return data.data;
  },
};
