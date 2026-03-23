"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAssignment, getAssignments, regenerateAssignment } from "@/services/api";
import { getSocket } from "@/lib/socket";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { AssignmentDoneEvent, AssignmentResult } from "@/types/assignment";
import { AssignmentOutputPage } from "@/components/assignment/paper/AssignmentOutputPage";

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
          typeof question.marks === "number" &&
          typeof question.sourceLine === "string"
      )
  );
};

const FORBIDDEN_TEXT_PATTERNS = [/generate exactly/i, /question\s*\d+\s+for\s+the\s+subject/i];

const containsForbiddenText = (value: string) => FORBIDDEN_TEXT_PATTERNS.some((pattern) => pattern.test(value));

const cleanVisibleText = (value: string) =>
  value
    .split(/\r?\n/)
    .filter((line) => !containsForbiddenText(line))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

const sanitizeAssignmentResult = (result: AssignmentResult | null): AssignmentResult | null => {
  if (!hasStructuredSections(result)) return null;

  const sections = result.sections
    .map((section) => ({
      title: cleanVisibleText(section.title) || "Section A",
      instruction: "Attempt all questions",
      questions: section.questions
        .map((question) => ({
          ...question,
          text: cleanVisibleText(question.text),
          sourceLine: cleanVisibleText(question.sourceLine),
          options: Array.isArray(question.options)
            ? question.options.map((option) => cleanVisibleText(option)).filter(Boolean)
            : undefined,
        }))
        .filter(
          (question) =>
            question.text.length > 0 &&
            question.sourceLine.length > 0 &&
            !containsForbiddenText(question.text)
        ),
    }))
    .filter((section) => section.questions.length > 0);

  if (sections.length === 0) {
    return null;
  }

  return { sections };
};

export function AssignmentPaperClient({ id }: AssignmentPaperClientProps) {
  const router = useRouter();
  const { assignmentId, result, setAssignmentId, setResult } = useAssignmentStore();
  const sanitizedCurrentResult = assignmentId === id ? sanitizeAssignmentResult(result) : null;
  const hasCurrentResult = assignmentId === id && sanitizedCurrentResult !== null;

  const [isWaiting, setIsWaiting] = useState(!hasCurrentResult);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await getAssignment(id);
        const { setHeader, setResult: setStoreResult } = useAssignmentStore.getState();

        setHeader({
          schoolName: data.schoolName || "",
          subjectName: data.subjectName || "",
          className: data.className || "",
          timeAllowed: data.timeAllowed || "",
        });

        if (data.status === "failed") {
          setErrorMessage(data.errorMessage || "Unable to extract readable text from the uploaded file.");
          setStoreResult(null);
          setIsWaiting(false);
          return;
        }

        if (data.status === "completed" && data.result) {
          setErrorMessage(null);
          setStoreResult(sanitizeAssignmentResult(data.result));
          setIsWaiting(false);
        }
      } catch (err) {
        console.error("Failed to fetch assignment:", err);
        setErrorMessage("Unable to fetch the generated assignment.");
        setIsWaiting(false);
      }
    };

    void fetchAssignment();

    const socket = getSocket();
    socket.connect();

    const onDone = async (payload: AssignmentDoneEvent) => {
      if (payload?.assignmentId !== id) return;

      setAssignmentId(payload.assignmentId);
      useAssignmentStore.getState().setHeader({
        schoolName: payload.schoolName,
        subjectName: payload.subjectName,
        className: payload.className,
        timeAllowed: payload.timeAllowed,
      });

      if (payload.errorMessage) {
        setResult(null);
        setErrorMessage(payload.errorMessage);
        setIsWaiting(false);
        setIsRegenerating(false);
        return;
      }

      setResult(sanitizeAssignmentResult(payload.result ?? null));
      const latestAssignments = await getAssignments().catch(() => null);
      if (latestAssignments) {
        useAssignmentStore.getState().setAssignments(latestAssignments);
      }
      setErrorMessage(null);
      setIsWaiting(false);
      setIsRegenerating(false);
    };

    socket.on("assignment_done", onDone);

    return () => {
      socket.off("assignment_done", onDone);
    };
  }, [id, setAssignmentId, setResult]);

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      setIsWaiting(true);
      setErrorMessage(null);
      setResult(null);
      await regenerateAssignment(id);
    } catch {
      setIsRegenerating(false);
      setIsWaiting(false);
      setErrorMessage("Unable to regenerate the assignment. Please try again.");
      router.push(`/assignment/${id}`);
    }
  };

  return (
    <AssignmentOutputPage
      result={hasCurrentResult ? sanitizedCurrentResult : null}
      isLoading={isWaiting || isRegenerating}
      errorMessage={errorMessage}
      onRegenerate={handleRegenerate}
    />
  );
}
