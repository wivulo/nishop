"use client"
import { redirect } from "next/navigation";

export default function LegacyManagementPage() {
  redirect("/management");
}
