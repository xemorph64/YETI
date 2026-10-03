import type { Metadata } from "next";
import { DisseminationClient } from "@/components/admin/DisseminationClient";

export const metadata: Metadata = {
  title: "Social Media Dissemination",
  description: "Upload a report → extract → generate channel drafts → review → approve → publish. The editorial production workspace.",
};

export default function DisseminationPage() {
  return (
      <DisseminationClient />
  );
}
