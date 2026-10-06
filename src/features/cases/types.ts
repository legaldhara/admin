export type RequestCaseStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ACTION_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CLOSED";

export type CaseAction =
  | "START_REVIEW"
  | "REQUEST_DOCUMENTS"
  | "REQUEST_PAYMENT"
  | "CANCEL_REQUIREMENT"
  | "APPROVE"
  | "REJECT"
  | "ATTACH_DELIVERABLE"
  | "COMPLETE"
  | "CLOSE"
  | "POST_MESSAGE";

export interface CommandBase {
  expectedVersion: number;
  idempotencyKey: string;
}

export interface CaseEvent {
  id: string;
  type: string;
  message: string | null;
  previousStatus: RequestCaseStatus | null;
  newStatus: RequestCaseStatus | null;
  actorRole: "ADMIN" | "COADMIN" | "USER" | "SYSTEM";
  createdAt: string;
}

export interface CaseAsset {
  id: string;
  label: string | null;
  secureUrl: string;
  mimeType: string;
  originalName: string;
  sizeBytes: number;
}

export interface CaseRequirement {
  id: string;
  type: "DOCUMENTS" | "PAYMENT";
  status: "OPEN" | "SATISFIED" | "CANCELLED";
  title: string;
  instructions: string | null;
  documentLabels: string[];
  dueAt: string | null;
  payment: {
    id: string;
    amountMinor: number;
    currency: string;
    purpose: string;
    status: string;
  } | null;
  assets: CaseAsset[];
}

export interface LifecycleResponse {
  case: {
    id: string;
    type: "APPLICATION" | "CERTIFICATE";
    status: RequestCaseStatus;
    version: number;
    submittedAt: string;
    approvedAt: string | null;
    rejectedAt: string | null;
    completedAt: string | null;
    closedAt: string | null;
  };
  timeline: CaseEvent[];
  requirements: CaseRequirement[];
  deliverables: CaseAsset[];
  availableActions: CaseAction[];
}

export interface CaseApi {
  get(caseId: string): Promise<LifecycleResponse>;
  uploadAsset(file: File): Promise<{ assetId: string }>;
  startReview(caseId: string, input: CommandBase): Promise<void>;
  postMessage(caseId: string, input: CommandBase & { message: string }): Promise<void>;
  requestDocuments(caseId: string, input: CommandBase & {
    title: string;
    instructions: string;
    documentLabels: string[];
  }): Promise<void>;
  requestPayment(caseId: string, input: CommandBase & {
    category: "INITIAL" | "OBJECTION" | "ADDITIONAL" | "CORRECTION";
    amountMinor: number;
    purpose: string;
  }): Promise<void>;
  cancelRequirement(caseId: string, requirementId: string, input: CommandBase & { reason: string }): Promise<void>;
  approve(caseId: string, input: CommandBase): Promise<void>;
  reject(caseId: string, input: CommandBase & { reason: string }): Promise<void>;
  attachDeliverable(caseId: string, input: CommandBase & { assetId: string; label?: string }): Promise<void>;
  complete(caseId: string, input: CommandBase & { completionSummary?: string; completionReference?: string }): Promise<void>;
  close(caseId: string, input: CommandBase): Promise<void>;
}
