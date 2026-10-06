import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { CaseActions } from "../features/cases/CaseActions";
import { CaseRequirements } from "../features/cases/CaseRequirements";
import { CaseTimeline } from "../features/cases/CaseTimeline";
import type { LifecycleResponse } from "../features/cases/types";
import ActionButton from "./UI/Button";

interface ApplicationDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApplication: {
    ticketNo: string;
    businessName?: string;
    serviceName?: string;
    lifecycle?: LifecycleResponse | null;
  };
  onRefresh: () => Promise<void>;
}

export default function ApplicationDetailsPanel({ isOpen, onClose, selectedApplication, onRefresh }: ApplicationDetailsPanelProps) {
  const lifecycle = selectedApplication.lifecycle;
  return (
    <AnimatePresence>
      {isOpen && <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <motion.aside initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-5xl flex-col overflow-hidden bg-background shadow-2xl">
          <header className="flex items-start justify-between gap-4 border-b border-border bg-card p-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{selectedApplication.ticketNo}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{[selectedApplication.businessName, selectedApplication.serviceName].filter(Boolean).join(" · ")}</p>
              {lifecycle && <p className="mt-2 text-sm font-semibold">{lifecycle.case.status.replace(/_/g, " ")}</p>}
            </div>
            <ActionButton label="Close" color="red" onClick={onClose} icon={<X className="h-4 w-4" />} />
          </header>
          <div className="grid flex-1 gap-6 overflow-y-auto p-5 lg:grid-cols-2">
            {!lifecycle ? <p role="alert" className="text-sm text-red-700">Lifecycle data is unavailable for this request.</p> : <>
              <div className="space-y-6">
                <section><h3 className="mb-3 text-lg font-bold">Open requirements</h3><CaseRequirements requirements={lifecycle.requirements} /></section>
                <section><h3 className="mb-3 text-lg font-bold">Lifecycle timeline</h3><CaseTimeline events={lifecycle.timeline} /></section>
              </div>
              <section><h3 className="mb-3 text-lg font-bold">Available actions</h3><CaseActions lifecycle={lifecycle} onRefresh={onRefresh} /></section>
            </>}
          </div>
        </motion.aside>
      </>}
    </AnimatePresence>
  );
}
