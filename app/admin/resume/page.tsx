import ResumeEditor from "./ResumeEditor";
import { getResume } from "@/lib/resume";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const resume = await getResume();
  return <ResumeEditor resume={resume} />;
}
