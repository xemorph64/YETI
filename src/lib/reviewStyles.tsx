/**
 * Shared vocabulary for review statuses — one chip style, one label, everywhere
 * submissions appear (researcher desk, admin review queue, dashboards).
 */

import { Check, CircleDashed, RotateCcw, ThumbsDown, Hourglass } from "lucide-react";
import type { ReviewStatus } from "@/lib/api/types";

export const REVIEW_STYLE: Record<
  ReviewStatus,
  { label: string; chip: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending review",
    chip: "text-sunrise border border-sunrise/50 bg-sunrise-dim",
    icon: <Hourglass className="size-3" strokeWidth={1.5} aria-hidden />,
  },
  UNDER_REVIEW: {
    label: "Under review",
    chip: "text-sunrise border border-sunrise/50 bg-sunrise-dim",
    icon: <CircleDashed className="size-3" strokeWidth={1.5} aria-hidden />,
  },
  APPROVED: {
    label: "Approved & discoverable",
    chip: "text-accent border border-accent/50 bg-accent-dim",
    icon: <Check className="size-3" strokeWidth={1.5} aria-hidden />,
  },
  REJECTED: {
    label: "Not accepted",
    chip: "text-danger border border-danger/50 bg-danger/10",
    icon: <ThumbsDown className="size-3" strokeWidth={1.5} aria-hidden />,
  },
  REVISION_REQUESTED: {
    label: "Revision requested",
    chip: "text-violet border border-violet/50 bg-violet-dim",
    icon: <RotateCcw className="size-3" strokeWidth={1.5} aria-hidden />,
  },
};
