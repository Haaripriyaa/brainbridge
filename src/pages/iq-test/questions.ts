
import { IQQuestion } from "./types";

export const iqTestQuestions: IQQuestion[] = [
  {
    id: 1,
    question: "Which number should come next in this pattern? 2, 4, 8, 16, ...",
    options: ["24", "28", "32", "36"],
    answer: 1, // 32
  },
  {
    id: 2,
    question: "If you rearrange the letters 'CIFAIPC', you would have the name of a:",
    options: ["City", "Animal", "Ocean", "River"],
    answer: 1, // PACIFIC - Ocean
  },
  {
    id: 3,
    question: "Which of the following can be folded to form a cube?",
    options: [
      "Cross with 6 squares",
      "Line with 6 squares", 
      "Square with 4 squares attached", 
      "Star with 6 points"
    ],
    answer: 0, // Cross with 6 squares
  },
  {
    id: 4,
    question: "Find the odd one out:",
    options: ["Twitter", "Instagram", "Telegram", "Television"],
    answer: 3, // Television
  },
  {
    id: 5,
    question: "Complete the analogy: Book is to Reading as Fork is to:",
    options: ["Drawing", "Writing", "Eating", "Cooking"],
    answer: 2, // Eating
  },
  {
    id: 6,
    question: "If all Zips are Zaps, and all Zaps are Zops, then:",
    options: [
      "All Zips are Zops", 
      "All Zops are Zips", 
      "No Zips are Zops", 
      "None of the above"
    ],
    answer: 0, // All Zips are Zops
  },
  {
    id: 7,
    question: "What comes next in the sequence: 1, 4, 9, 16, 25, ...",
    options: ["30", "36", "42", "49"],
    answer: 1, // 36 (square numbers: 1, 4, 9, 16, 25, 36)
  },
  {
    id: 8,
    question: "A plane crashes on the border of the US and Canada. Where do they bury the survivors?",
    options: ["US", "Canada", "Both countries", "Survivors aren't buried"],
    answer: 3, // Survivors aren't buried
  },
];
