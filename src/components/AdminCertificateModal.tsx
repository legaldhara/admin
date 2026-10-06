import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { secureApi } from "../config/apiClient";
import { CaseActions } from "../features/cases/CaseActions";
import { CaseRequirements } from "../features/cases/CaseRequirements";
import { CaseTimeline } from "../features/cases/CaseTimeline";
import type { LifecycleResponse } from "../features/cases/types";
import ActionButton from "./UI/Button";

interface AdminCertificateModalProps { isOpen: boolean; onClose: () => void; requestNo: string; onUpdated?: () => void; }
interface CertificateDetails { requestNo: string; subject: string; description: string; lifecycle: LifecycleResponse | null; }

export default function AdminCertificateModal({ isOpen, onClose, requestNo, onUpdated }: AdminCertificateModalProps) {
  const [data, setData] = useState<CertificateDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await secureApi.get<{ success: boolean; data: CertificateDetails }>(`/api/v1/certificate/${requestNo}`);
      setData(response.data.data);
      onUpdated?.();
    } catch (caught: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(caught) ? caught.response?.data?.message : null;
      setError(message || "Failed to fetch certificate details");
    } finally {
      setLoading(false);
    }
  }, [onUpdated, requestNo]);

  useEffect(() => { if (isOpen && requestNo) void fetchDetails(); }, [fetchDetails, isOpen, requestNo]);
  if (!isOpen) return null;

  return <AnimatePresence><>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="fixed inset-4 z-50 mx-auto flex max-w-6xl flex-col overflow-hidden bg-background shadow-2xl md:inset-10">
      <header className="flex items-start justify-between border-b border-border bg-card p-5">
        <div><h2 className="text-2xl font-bold">{data?.subject || requestNo}</h2><p className="text-sm text-muted-foreground">{requestNo}</p>{data?.lifecycle && <p className="mt-2 text-sm font-semibold">{data.lifecycle.case.status.replace(/_/g, " ")}</p>}</div>
        <ActionButton label="Close" color="red" onClick={onClose} icon={<X className="h-4 w-4" />} />
      </header>
      <div className="flex-1 overflow-y-auto p-5">
        {loading && <p>Loading request…</p>}
        {error && <p role="alert" className="text-red-700">{error}</p>}
        {!loading && data?.description && <p className="mb-6 text-sm text-muted-foreground">{data.description}</p>}
        {!loading && data && !data.lifecycle && <p role="alert" className="text-red-700">Lifecycle data is unavailable for this request.</p>}
        {!loading && data?.lifecycle && <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <section><h3 className="mb-3 text-lg font-bold">Open requirements</h3><CaseRequirements requirements={data.lifecycle.requirements} /></section>
            <section><h3 className="mb-3 text-lg font-bold">Lifecycle timeline</h3><CaseTimeline events={data.lifecycle.timeline} /></section>
          </div>
          <section><h3 className="mb-3 text-lg font-bold">Available actions</h3><CaseActions lifecycle={data.lifecycle} onRefresh={fetchDetails} /></section>
        </div>}
      </div>
    </motion.div>
  </></AnimatePresence>;
}
