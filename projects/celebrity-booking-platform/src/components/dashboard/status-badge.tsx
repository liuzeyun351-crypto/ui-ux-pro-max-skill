import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/types";

const STATUS_META: Record<BookingStatus, { label: string; tone: "gold" | "neutral" | "success" | "warning" | "danger" | "info" }> = {
  DRAFT: { label: "Draft", tone: "neutral" },
  SUBMITTED: { label: "Submitted", tone: "info" },
  UNDER_REVIEW: { label: "Under review", tone: "warning" },
  CONTRACT_SENT: { label: "Contract sent", tone: "gold" },
  DEPOSIT_PAID: { label: "Deposit in escrow", tone: "gold" },
  CONFIRMED: { label: "Confirmed", tone: "success" },
  COMPLETED: { label: "Completed", tone: "success" },
  CANCELLED: { label: "Cancelled", tone: "danger" },
  REFUNDED: { label: "Refunded", tone: "neutral" },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as BookingStatus] ?? { label: status, tone: "neutral" as const };
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export const BOOKING_PIPELINE: BookingStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "CONTRACT_SENT",
  "DEPOSIT_PAID",
  "CONFIRMED",
  "COMPLETED",
];
