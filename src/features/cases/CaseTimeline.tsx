import type { CaseEvent } from "./types";

const eventLabels: Record<string, string> = {
  CASE_CREATED: "Request submitted",
  REVIEW_STARTED: "Review started",
  DOCUMENTS_REQUESTED: "Documents requested",
  DOCUMENTS_SUBMITTED: "Documents submitted",
  PAYMENT_REQUESTED: "Payment requested",
  PAYMENT_RECEIVED: "Payment received",
  REQUIREMENT_CANCELLED: "Requirement cancelled",
  MESSAGE_POSTED: "Message posted",
  CASE_APPROVED: "Request approved",
  CASE_REJECTED: "Request rejected",
  DELIVERABLE_ATTACHED: "Deliverable attached",
  CASE_COMPLETED: "Request completed",
  CASE_CLOSED: "Request closed",
};

export function CaseTimeline({ events }: { events: CaseEvent[] }) {
  if (events.length === 0) return <p className="text-sm text-muted-foreground">No lifecycle activity yet.</p>;

  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li key={event.id} className="border-l-2 border-border pl-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong className="text-sm text-foreground">{eventLabels[event.type] ?? event.type.replace(/_/g, " ")}</strong>
            <time className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString("en-IN")}</time>
          </div>
          {event.message && <p className="mt-1 text-sm text-muted-foreground">{event.message}</p>}
          <p className="mt-1 text-xs text-muted-foreground">By {event.actorRole.toLowerCase()}</p>
        </li>
      ))}
    </ol>
  );
}
