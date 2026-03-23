import { AssignmentPaperClient } from "@/components/assignment/AssignmentPaperClient";

type AssignmentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const { id } = await params;

  return <AssignmentPaperClient id={id} />;
}
