import { AssignmentOutputPage } from "@/components/assignment/AssignmentOutputPage";
import { AssignmentResult } from "@/types/assignment";

export default function HomePage() {
  return <AssignmentOutputPage result={sampleAssignment} />;
}

const sampleAssignment: AssignmentResult = {
  sections: [
    {
      title: "Section A",
      instruction: "Short Answer Questions",
      questions: [
        { text: "Define electroplating. Explain its purpose.", difficulty: "easy", marks: 2 },
        {
          text: "What is the role of a conductor in the process of electrolysis?",
          difficulty: "medium",
          marks: 2,
        },
        {
          text: "Why does a solution of copper sulphate conduct electricity?",
          difficulty: "easy",
          marks: 2,
        },
        {
          text: "Describe one example of the chemical effect of electric current in daily life.",
          difficulty: "medium",
          marks: 2,
        },
        {
          text: "Explain why electric current is said to have chemical effects.",
          difficulty: "medium",
          marks: 2,
        },
        {
          text: "How is sodium hydroxide prepared during the electrolysis of brine?",
          difficulty: "hard",
          marks: 2,
        },
        {
          text: "What happens at the cathode and anode during the electrolysis of water?",
          difficulty: "hard",
          marks: 2,
        },
        {
          text: "Mention the type of current used in electroplating and justify why it is used.",
          difficulty: "easy",
          marks: 2,
        },
        {
          text: "What is the importance of electric current in the field of metallurgy?",
          difficulty: "medium",
          marks: 2,
        },
        {
          text: "Explain with a chemical equation how copper is deposited during electroplating of an object.",
          difficulty: "hard",
          marks: 2,
        },
      ],
    },
  ],
};
