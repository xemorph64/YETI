import type { Metadata } from "next";
import { SancharClient } from "@/components/admin/SancharClient";

export const metadata: Metadata = {
  title: "Sanchar Media Engine",
  description: "Upload a report → extract → generate channel drafts → review → approve → publish. The editorial production workspace.",
};

export default function SancharPage() {
  return (
      <SancharClient />
  );
}
