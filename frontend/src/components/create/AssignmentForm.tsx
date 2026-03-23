"use client";

import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FooterButtons } from "@/components/create/FooterButtons";
import { CalendarIcon, PlusIcon } from "@/components/create/icons";
import { QuestionRow } from "@/components/create/QuestionRow";
import { Summary } from "@/components/create/Summary";
import { TopBar } from "@/components/create/TopBar";
import { UploadBox } from "@/components/create/UploadBox";
import { createAssignment } from "@/services/api";
import { useAssignmentStore } from "@/store/assignment.store";
import {
  AssignmentQuestionType,
  CreateAssignmentPayload,
  DashboardAssignment,
  UploadedDocumentPayload,
} from "@/types/assignment";

const QUESTION_TYPES = [
  { label: "Multiple Choice Questions", value: "Multiple Choice Questions" },
  { label: "Short Questions", value: "Short Questions" },
  { label: "Diagram/Graph-Based Questions", value: "Diagram/Graph-Based Questions" },
  { label: "Numerical Problems", value: "Numerical Problems" },
];

type FormRow = AssignmentQuestionType & {
  id: string;
};

type FieldErrors = {
  dueDate?: string;
  questionTypes?: string;
  submit?: string;
};

const INITIAL_ROWS: FormRow[] = [
  { id: "row-1", type: "Multiple Choice Questions", count: 0, marks: 0 },
  { id: "row-2", type: "Short Questions", count: 0, marks: 0 },
  { id: "row-3", type: "Diagram/Graph-Based Questions", count: 0, marks: 0 },
  { id: "row-4", type: "Numerical Problems", count: 0, marks: 0 },
];

const DATE_PLACEHOLDER = "DD-MM-YYYY";
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

const formatDateInput = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
};

const isValidDate = (value: string) => {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return false;

  const [dayString, monthString, yearString] = value.split("-");
  const day = Number(dayString);
  const month = Number(monthString);
  const year = Number(yearString);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const isSupportedUpload = (file: File) =>
  file.type === "application/pdf" || file.type.startsWith("image/");

export function AssignmentForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addAssignment, setAssignmentId, setResult } = useAssignmentStore();

  const [dueDate, setDueDate] = useState("");
  const [questionTypes, setQuestionTypes] = useState<FormRow[]>(INITIAL_ROWS);
  const [schoolName, setSchoolName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [className, setClassName] = useState("");
  const [timeAllowed, setTimeAllowed] = useState("");
  const [instructions, setInstructions] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedDocumentPayload | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextId, setNextId] = useState(INITIAL_ROWS.length + 1);

  const totals = useMemo(
    () =>
      questionTypes.reduce(
        (acc, questionType) => {
          acc.totalQuestions += questionType.count;
          acc.totalMarks += questionType.count * questionType.marks;
          return acc;
        },
        { totalQuestions: 0, totalMarks: 0 }
      ),
    [questionTypes]
  );

  const validate = () => {
    const nextErrors: FieldErrors = {};

    if (!dueDate || !isValidDate(dueDate)) {
      nextErrors.dueDate = "Enter a valid due date";
    }

    if (
      questionTypes.length === 0 ||
      questionTypes.some((questionType) => questionType.count <= 0 || questionType.marks <= 0)
    ) {
      nextErrors.questionTypes = "Add at least one valid question type";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleDateChange = (value: string) => {
    setDueDate(formatDateInput(value));
    setErrors((current) => ({ ...current, dueDate: undefined, submit: undefined }));
  };

  const handleTypeChange = (id: string, type: string) => {
    setQuestionTypes((current) =>
      current.map((questionType) => (questionType.id === id ? { ...questionType, type } : questionType))
    );
    setErrors((current) => ({ ...current, questionTypes: undefined, submit: undefined }));
  };

  const handleStep = (id: string, key: "count" | "marks", delta: number) => {
    setQuestionTypes((current) =>
      current.map((questionType) =>
        questionType.id === id
          ? { ...questionType, [key]: Math.max(0, questionType[key] + delta) }
          : questionType
      )
    );
    setErrors((current) => ({ ...current, questionTypes: undefined, submit: undefined }));
  };

  const handleAddRow = () => {
    setQuestionTypes((current) => [
      ...current,
      { id: `row-${nextId}`, type: QUESTION_TYPES[0].value, count: 0, marks: 0 },
    ]);
    setNextId((current) => current + 1);
    setErrors((current) => ({ ...current, questionTypes: undefined, submit: undefined }));
  };

  const handleRemoveRow = (id: string) => {
    setQuestionTypes((current) =>
      current.length > 1 ? current.filter((questionType) => questionType.id !== id) : current
    );
    setErrors((current) => ({ ...current, submit: undefined }));
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }
        reject(new Error("Unable to read the selected file."));
      };
      reader.onerror = () => reject(new Error("Unable to read the selected file."));
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setErrors((current) => ({ ...current, submit: undefined }));

    if (!file) {
      setUploadedFile(null);
      return;
    }

    if (!isSupportedUpload(file)) {
      setUploadedFile(null);
      setErrors((current) => ({
        ...current,
        submit: "Upload a PDF, PNG, JPG, JPEG, or WEBP file.",
      }));
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      setUploadedFile(null);
      setErrors((current) => ({
        ...current,
        submit: "Please upload a file smaller than 10MB.",
      }));
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUploadedFile({
        name: file.name,
        mimeType: file.type || "application/octet-stream",
        dataUrl,
      });
    } catch {
      setUploadedFile(null);
      setErrors((current) => ({
        ...current,
        submit: "Unable to read the selected file. Please try another file.",
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const payload: CreateAssignmentPayload = {
      schoolName: schoolName.trim(),
      subjectName: subjectName.trim(),
      className: className.trim(),
      timeAllowed: timeAllowed.trim(),
      dueDate,
      questionTypes: questionTypes.map((questionType) => ({
        type: questionType.type,
        count: questionType.count,
        marks: questionType.marks,
      })),
      numberOfQuestions: totals.totalQuestions,
      marks: totals.totalMarks,
      instructions: instructions.trim(),
      uploadedFile: uploadedFile ?? undefined,
    };

    setIsSubmitting(true);
    setResult(null);

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("last_assignment_payload", JSON.stringify(payload));
      }

      const response = await createAssignment(payload);
      const { setHeader } = useAssignmentStore.getState();
      setHeader({
        schoolName: payload.schoolName,
        subjectName: payload.subjectName,
        className: payload.className,
        timeAllowed: payload.timeAllowed,
      });
      setAssignmentId(response.id);
      const createdAssignment: DashboardAssignment = {
        id: response.id,
        title: payload.subjectName.trim() ? `Quiz on ${payload.subjectName.trim()}` : "Quiz on Electricity",
        assignedOn: new Date().toISOString(),
        dueDate: payload.dueDate,
        status: "processing",
      };
      addAssignment(createdAssignment);
      router.push(`/assignment/${response.id}`);
    } catch {
      setErrors((current) => ({ ...current, submit: "Unable to create assignment. Please try again." }));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-20px)] rounded-[18px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92)_0%,_rgba(234,234,234,0.96)_36%,_#d7d7d7_100%)]">
      <main className="min-w-0 flex-1">
          <TopBar />

          <section className="px-[8px] pb-[102px] pt-[10px] lg:px-[14px] lg:pb-[20px] lg:pt-[10px]">
            <div className="lg:pl-[2px]">
              <div className="hidden lg:block">
                <div className="flex items-start gap-[8px]">
                  <span className="mt-[4px] h-[8px] w-[8px] rounded-full bg-[#60d98a] shadow-[0_0_0_2px_rgba(96,217,138,0.2)]" />
                  <div>
                    <h1 className="text-[21px] font-semibold leading-none text-[#2a2a2a]">Create Assignment</h1>
                    <p className="mt-[4px] text-[11px] leading-none text-[#adadad]">
                      Set up a new assignment for your students
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-[12px] h-[3px] rounded-full bg-[#d6d6d6] lg:mt-[14px] lg:max-w-[492px]">
                <div className="h-full w-[47%] rounded-full bg-[#5e5e5e]" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto mt-[16px] max-w-[420px] lg:mt-[18px] lg:max-w-[628px]">
              <div className="rounded-[22px] bg-[#f9f9f9] px-[12px] py-[14px] shadow-[0_18px_40px_rgba(72,72,72,0.08)] lg:px-[18px] lg:py-[14px]">
                <h2 className="text-[15px] font-semibold text-[#2b2b2b]">Assignment Details</h2>
                <p className="mt-[3px] text-[10px] text-[#a0a0a0]">Basic information about your assignment</p>

                <div className="mt-[14px]">
                  <UploadBox fileInputRef={fileInputRef} onChange={handleFileChange} fileName={uploadedFile?.name} />
                </div>

                <div className="mt-[10px] grid grid-cols-1 gap-[10px] md:grid-cols-2">
                  <div>
                    <label className="mb-[6px] block text-[12px] font-medium text-[#292929]">School Name</label>
                    <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="e.g. Delhi Public School" className="h-[32px] w-full rounded-full border border-[#e8e8e8] bg-[#f8f8f8] px-[12px] text-[11px] text-[#3a3a3a] outline-none" />
                  </div>
                  <div>
                    <label className="mb-[6px] block text-[12px] font-medium text-[#292929]">Subject</label>
                    <input type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g. Science" className="h-[32px] w-full rounded-full border border-[#e8e8e8] bg-[#f8f8f8] px-[12px] text-[11px] text-[#3a3a3a] outline-none" />
                  </div>
                  <div>
                    <label className="mb-[6px] block text-[12px] font-medium text-[#292929]">Class</label>
                    <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. 5th" className="h-[32px] w-full rounded-full border border-[#e8e8e8] bg-[#f8f8f8] px-[12px] text-[11px] text-[#3a3a3a] outline-none" />
                  </div>
                  <div>
                    <label className="mb-[6px] block text-[12px] font-medium text-[#292929]">Time Allowed</label>
                    <input type="text" value={timeAllowed} onChange={(e) => setTimeAllowed(e.target.value)} placeholder="e.g. 45 minutes" className="h-[32px] w-full rounded-full border border-[#e8e8e8] bg-[#f8f8f8] px-[12px] text-[11px] text-[#3a3a3a] outline-none" />
                  </div>
                </div>

                <div className="mt-[10px]">
                  <label className="mb-[6px] block text-[12px] font-medium text-[#292929]">Due Date</label>
                  <div className="relative">
                    <input type="text" inputMode="numeric" value={dueDate} onChange={(event) => handleDateChange(event.target.value)} placeholder={DATE_PLACEHOLDER} className="h-[32px] w-full rounded-full border border-[#e8e8e8] bg-[#f8f8f8] pl-[12px] pr-[34px] text-[11px] text-[#3a3a3a] outline-none placeholder:text-[#c0c0c0]" />
                    <span className="pointer-events-none absolute inset-y-0 right-[11px] flex items-center text-[#4d4d4d]">
                      <CalendarIcon />
                    </span>
                  </div>
                  {errors.dueDate ? <p className="mt-[5px] text-[10px] text-[#dc2626]">{errors.dueDate}</p> : null}
                </div>

                <div className="mt-[10px]">
                  <div className="mb-[6px] lg:grid lg:grid-cols-[1.3fr_0.9fr] lg:gap-[12px]">
                    <p className="text-[12px] font-medium text-[#292929]">Question Type</p>
                    <div className="hidden grid-cols-2 gap-[8px] lg:grid">
                      <p className="text-center text-[10px] text-[#5e5e5e]">No. of Questions</p>
                      <p className="text-center text-[10px] text-[#5e5e5e]">Marks</p>
                    </div>
                  </div>

                  <div className="space-y-[8px]">
                    {questionTypes.map((questionType) => (
                      <QuestionRow
                        key={questionType.id}
                        value={questionType}
                        canRemove={questionTypes.length > 1}
                        options={QUESTION_TYPES}
                        onTypeChange={handleTypeChange}
                        onStep={handleStep}
                        onRemove={handleRemoveRow}
                      />
                    ))}
                  </div>

                  {errors.questionTypes ? <p className="mt-[5px] text-[10px] text-[#dc2626]">{errors.questionTypes}</p> : null}

                  <button type="button" onClick={handleAddRow} className="mt-[10px] inline-flex items-center gap-[8px] text-[11px] font-medium text-[#2f2f2f]">
                    <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2f2f2f] text-white">
                      <PlusIcon />
                    </span>
                    <span>Add Question Type</span>
                  </button>
                </div>

                <div className="mt-[12px] flex justify-end">
                  <Summary totalQuestions={totals.totalQuestions} totalMarks={totals.totalMarks} />
                </div>

                <div className="mt-[10px]">
                  <label className="mb-[6px] block text-[12px] font-medium text-[#292929]">
                    Additional Information (For better output)
                  </label>
                  <textarea rows={4} value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="e.g. Generate only fact-based questions from the uploaded chapter and keep them easy." className="min-h-[76px] w-full rounded-[12px] border border-dashed border-[#dddddd] bg-[#fbfbfb] px-[12px] py-[10px] text-[10px] leading-[1.45] text-[#3c3c3c] outline-none placeholder:text-[#a8a8a8]" />
                </div>
              </div>

              {errors.submit ? <p className="mt-[8px] text-[11px] text-[#dc2626]">{errors.submit}</p> : null}
              <FooterButtons isSubmitting={isSubmitting} onPrevious={() => router.push("/assignments")} />
            </form>
          </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 px-[4px] pb-[4px] lg:hidden">
        <nav className="rounded-[17px] bg-[#1c1c1c] px-[10px] py-[9px] shadow-[0_14px_28px_rgba(0,0,0,0.22)]">
          <div className="grid grid-cols-4">
            <BottomNavItem label="Home" icon={<GridIcon />} onClick={() => router.push("/")} />
            <BottomNavItem label="Assignments" icon={<PeopleIcon />} active onClick={() => router.push("/assignments")} />
            <BottomNavItem label="Create" icon={<LibraryIcon />} onClick={() => router.push("/create")} />
            <BottomNavItem label="AI Toolkit" icon={<SparkIcon />} />
          </div>
        </nav>
      </div>
    </div>
  );
}

function BottomNavItem({ icon, label, active = false, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center justify-center gap-[2px] py-[2px]">
      <span className={active ? "text-white" : "text-white/28"}>{icon}</span>
      <span className={active ? "text-[9px] font-medium text-white" : "text-[9px] text-white/28"}>{label}</span>
    </button>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2.6" y="2.6" width="4.8" height="4.8" rx="1.2" fill="currentColor" />
      <rect x="10.6" y="2.6" width="4.8" height="4.8" rx="1.2" fill="currentColor" />
      <rect x="2.6" y="10.6" width="4.8" height="4.8" rx="1.2" fill="currentColor" />
      <rect x="10.6" y="10.6" width="4.8" height="4.8" rx="1.2" fill="currentColor" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M6.2 8C7.41503 8 8.4 7.01503 8.4 5.8C8.4 4.58497 7.41503 3.6 6.2 3.6C4.98497 3.6 4 4.58497 4 5.8C4 7.01503 4.98497 8 6.2 8Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11.8 7.3C12.7941 7.3 13.6 6.49411 13.6 5.5C13.6 4.50589 12.7941 3.7 11.8 3.7C10.8059 3.7 10 4.50589 10 5.5C10 6.49411 10.8059 7.3 11.8 7.3Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.4 13.9C4.14756 12.3803 5.26156 11.7 6.742 11.7C8.22244 11.7 9.33644 12.3803 10.084 13.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.3 13.2C10.8932 12.1591 11.8393 11.65 13.1382 11.65C13.5891 11.65 13.9764 11.7111 14.3 11.8333" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M5.5 2.8H12.6V15.2H5.5C4.67157 15.2 4 14.5284 4 13.7V4.3C4 3.47157 4.67157 2.8 5.5 2.8Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.7 6.2H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M8.95 2.4C9.46 5.31 11.69 7.54 14.6 8.05C11.69 8.56 9.46 10.79 8.95 13.7C8.44 10.79 6.21 8.56 3.3 8.05C6.21 7.54 8.44 5.31 8.95 2.4Z" fill="currentColor" />
      <path d="M13.05 3.4L13.35 4.15L14.1 4.45L13.35 4.75L13.05 5.5L12.75 4.75L12 4.45L12.75 4.15L13.05 3.4Z" fill="currentColor" />
    </svg>
  );
}
