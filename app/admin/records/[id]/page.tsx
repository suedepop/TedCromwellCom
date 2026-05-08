import { notFound } from "next/navigation";
import RecordEditor from "./RecordEditor";
import { getRecord } from "@/lib/records";

export const dynamic = "force-dynamic";

export default async function EditRecordPage({ params }: { params: { id: string } }) {
  const record = await getRecord(params.id);
  if (!record) notFound();
  return <RecordEditor record={record} />;
}
