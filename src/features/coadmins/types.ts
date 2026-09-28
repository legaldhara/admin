export interface CoAdminItem {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  mfaEnrolled: boolean;
  createdAt: string;
  lastLogin: string | null;
  adminInvitation: {
    deliveryStatus: "PENDING" | "SENT" | "FAILED";
    lastSentAt: string | null;
    lastErrorAt: string | null;
  } | null;
}

export interface CoAdminPageResult {
  data: CoAdminItem[];
  pagination: { page: number; limit: number; total: number };
}

export interface CoAdminApi {
  list(input: { page: number; limit: number; search?: string }): Promise<CoAdminPageResult>;
  invite(input: { fullName: string; email: string }): Promise<unknown>;
  resend(id: string): Promise<unknown>;
  setActive(id: string, active: boolean): Promise<unknown>;
}
