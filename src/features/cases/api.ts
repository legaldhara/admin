import { secureApi } from "../../config/apiClient";
import type { CaseApi, LifecycleResponse } from "./types";

const post = async (path: string, input: object): Promise<void> => {
  await secureApi.post(path, input);
};

export const caseApi: CaseApi = {
  async get(caseId) {
    const response = await secureApi.get<{ success: true; data: LifecycleResponse }>(`/api/v1/cases/${caseId}`);
    return response.data.data;
  },
  async uploadAsset(file) {
    const body = new FormData();
    body.append("files", file);
    const response = await secureApi.post<{ assets: Array<{ assetId: string }> }>("/api/v1/media/upload", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const asset = response.data.assets[0];
    if (!asset) throw new Error("Upload did not return an asset");
    return asset;
  },
  startReview: (caseId, input) => post(`/api/v1/cases/${caseId}/review`, input),
  postMessage: (caseId, input) => post(`/api/v1/cases/${caseId}/messages`, input),
  requestDocuments: (caseId, input) => post(`/api/v1/cases/${caseId}/requirements/documents`, input),
  requestPayment: (caseId, input) => post(`/api/v1/cases/${caseId}/requirements/payment`, input),
  cancelRequirement: (caseId, requirementId, input) =>
    post(`/api/v1/cases/${caseId}/requirements/${requirementId}/cancel`, input),
  approve: (caseId, input) => post(`/api/v1/cases/${caseId}/approve`, input),
  reject: (caseId, input) => post(`/api/v1/cases/${caseId}/reject`, input),
  attachDeliverable: (caseId, input) => post(`/api/v1/cases/${caseId}/deliverables`, input),
  complete: (caseId, input) => post(`/api/v1/cases/${caseId}/complete`, input),
  close: (caseId, input) => post(`/api/v1/cases/${caseId}/close`, input),
};
