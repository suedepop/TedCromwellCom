import type { Metadata } from "next";
import ResumeView from "@/components/resume/ResumeView";
import { getResume } from "@/lib/resume";

export const metadata: Metadata = { title: "Resume — Ted Cromwell" };

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const resume = await getResume();
  if (!resume) {
    return (
      <section className="max-w-2xl mx-auto">
        <h1 className="font-display text-4xl">Resume</h1>
        <p className="text-muted mt-4">Coming soon.</p>
      </section>
    );
  }
  return (
    <div className="max-w-3xl mx-auto">
      <ResumeView resume={resume} />
    </div>
  );
}
