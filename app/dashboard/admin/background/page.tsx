// ✅ No "use client" here
import { prisma } from "@/app/lib/prisma";
import BackgroundViewer from "./BackgroundViewer";

export default async function BackgroundPage() {
  return <BackgroundViewer />;
}
