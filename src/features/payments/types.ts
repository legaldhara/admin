export type AdminRole = "ADMIN" | "COADMIN";

export interface PaymentRefundSummary {
  status: "REQUESTED" | "PENDING" | "PROCESSED" | "FAILED";
  gatewayRefundId?: string | null;
}

export interface PaymentAttemptSummary {
  id: string;
  status: "CREATING" | "PENDING" | "AUTHORIZED" | "SUCCESS" | "FAILED" | "EXPIRED" | "DUPLICATE_SUCCESS";
  gatewayPaymentId: string | null;
  refund: PaymentRefundSummary | null;
}
