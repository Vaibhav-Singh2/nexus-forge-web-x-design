import { getJourney } from "@/lib/data";
import { notFound } from "next/navigation";
import TrailheadClient from "./TrailheadClient";

export default async function TrailheadPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const journey = await getJourney(chapterId);

  if (!journey) {
    return notFound();
  }

  return <TrailheadClient journey={journey} />;
}
