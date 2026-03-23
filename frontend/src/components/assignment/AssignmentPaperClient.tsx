"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAssignment, getAssignment } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useAssignmentStore } from "@/store/assignment.store";
import { AssignmentDoneEvent, AssignmentResult, CreateAssignmentPayload } from "@/types/assignment";
import { AssignmentOutputPage } from "./AssignmentOutputPage";

type AssignmentPaperClientProps = {
  id: string;
};

const hasStructuredSections = (result: AssignmentResult | null): result is AssignmentResult => {
  if (!result || !Array.isArray(result.sections)) return false;

  return result.sections.every(
    (section) =>
      typeof section.title === "string" &&
      Array.isArray(section.questions) &&
      section.questions.every(
        (question) =>
          typeof question.text === "string" &&
          typeof question.difficulty === "string" &&
          typeof question.marks === "number"
      )
  );
};

export function AssignmentPaperClient({ id }: AssignmentPaperClientProps) {
  const router = useRouter();
  const { assignmentId, result, setAssignmentId, setResult } = useAssignmentStore();
  const hasCurrentResult = assignmentId === id && hasStructuredSections(result);

  const [isWaiting, setIsWaiting] = useState(!hasCurrentResult);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await getAssignment(id);
        const { setHeader, setResult } = useAssignmentStore.getState();
        
        setHeader({
          schoolName: data.schoolName || "",
          subjectName: data.subjectName || "",
          className: data.className || "",
          timeAllowed: data.timeAllowed || "",
        });

        if (data.status === "completed" && data.result) {
          setResult(data.result);
          setIsWaiting(false);
        }
      } catch (err) {
        console.error("Failed to fetch assignment:", err);
      }
    };

    fetchAssignment();

    const socket = getSocket();
    socket.connect();

    const onDone = (payload: AssignmentDoneEvent) => {
      if (payload?.assignmentId !== id) return;

      setAssignmentId(payload.assignmentId);
      setResult(payload.result);
      useAssignmentStore.getState().setHeader({
        schoolName: payload.schoolName,
        subjectName: payload.subjectName,
        className: payload.className,
        timeAllowed: payload.timeAllowed,
      });
      setIsWaiting(false);
      setIsRegenerating(false);
    };

    socket.on("assignment_done", onDone);

    return () => {
      socket.off("assignment_done", onDone);
    };
  }, [id, setAssignmentId, setResult]);

  const handleCreateNew = async () => {
    if (typeof window === "undefined") return;

    const serialized = window.localStorage.getItem("last_assignment_payload");
    if (!serialized) {
      router.push("/create");
      return;
    }

    try {
      setIsRegenerating(true);
      setIsWaiting(true);
      setResult(null);

      const payload = JSON.parse(serialized) as CreateAssignmentPayload;
      const response = await createAssignment(payload);
      setAssignmentId(response.id);
      router.push(`/assignment/${response.id}`);
    } catch {
      setIsRegenerating(false);
      router.push("/create");
    }
  };

  return (
    <AssignmentOutputPage
      result={hasCurrentResult ? result : null}
      isLoading={isWaiting || isRegenerating}
      onCreateNew={handleCreateNew}
    />
  );
}
