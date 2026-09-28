import { secureApi } from "../../config/apiClient";

export const paymentAdminApi = {
  async reconcile(attemptId: string): Promise<void> {
    await secureApi.post(`/api/v1/payments/admin/${attemptId}/reconcile`);
  },
  async refund(attemptId: string, input: { reason: string }): Promise<void> {
    await secureApi.post(`/api/v1/payments/admin/${attemptId}/refund`, input);
  },
};
