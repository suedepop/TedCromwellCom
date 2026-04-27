import ResumeView from "@/components/resume/ResumeView";
import { getResume } from "@/lib/resume";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Resume",
  description: "Senior consultant, systems architect, SAFe® 5 Agilist — 25+ years.",
  path: "/resume",
  type: "profile",
});

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
