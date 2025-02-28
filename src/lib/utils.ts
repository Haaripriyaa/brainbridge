
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

// For demo purposes
export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Sample data for the demo
export const sampleQuizData = [
  {
    id: 1,
    question: "The mode of reproduction in bacteria is by?",
    options: [
      { id: "A", text: "Formation of gametes" },
      { id: "B", text: "Endospore formation" },
      { id: "C", text: "Conjugation" },
      { id: "D", text: "Zoospore formation" },
    ],
    correctAnswer: "C",
    explanation: "Bacteria reproduce asexually through binary fission, but can also exchange genetic material through a process called conjugation, which is a type of horizontal gene transfer.",
    image: "https://images.unsplash.com/photo-1566221857770-374d3c55970b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    question: "Which organelle is known as the 'powerhouse of the cell'?",
    options: [
      { id: "A", text: "Nucleus" },
      { id: "B", text: "Mitochondria" },
      { id: "C", text: "Endoplasmic Reticulum" },
      { id: "D", text: "Golgi Apparatus" },
    ],
    correctAnswer: "B",
    explanation: "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), which is used as a source of chemical energy."
  },
  {
    id: 3,
    question: "What is the primary function of DNA?",
    options: [
      { id: "A", text: "Energy production" },
      { id: "B", text: "Protein synthesis" },
      { id: "C", text: "Store genetic information" },
      { id: "D", text: "Cell division" },
    ],
    correctAnswer: "C",
    explanation: "DNA (deoxyribonucleic acid) is the genetic material that carries the instructions for the development, functioning, growth, and reproduction of all known organisms."
  },
  {
    id: 4,
    question: "Which of the following is NOT part of the central dogma of molecular biology?",
    options: [
      { id: "A", text: "DNA replication" },
      { id: "B", text: "RNA transcription" },
      { id: "C", text: "Protein translation" },
      { id: "D", text: "Reverse transcription" },
    ],
    correctAnswer: "A",
    explanation: "The central dogma of molecular biology describes the flow of genetic information within a biological system: DNA → RNA → Protein. DNA replication is not part of this directional flow but is a separate process that creates copies of DNA."
  },
  {
    id: 5,
    question: "Which of the following is a difference between prokaryotic and eukaryotic cells?",
    options: [
      { id: "A", text: "Prokaryotes have membrane-bound organelles" },
      { id: "B", text: "Eukaryotes have a cell wall" },
      { id: "C", text: "Prokaryotes lack a defined nucleus" },
      { id: "D", text: "Eukaryotes cannot perform photosynthesis" },
    ],
    correctAnswer: "C",
    explanation: "Prokaryotic cells lack a defined, membrane-enclosed nucleus. Instead, their genetic material is found in a region called the nucleoid that has no membrane surrounding it."
  }
];

export const sampleTodoData = [
  {
    id: "1",
    title: "Study 10 recent test lessons",
    dueDate: "2023-12-01",
    completed: false
  },
  {
    id: "2",
    title: "Cover basic level",
    dueDate: "2023-12-03",
    completed: false
  },
  {
    id: "3",
    title: "Take up the mcq at the end of the day",
    dueDate: "2023-12-05",
    completed: false
  }
];

export const sampleChatMessages = [
  {
    id: "1",
    sender: "user",
    text: "Why does every cell in our body contain DNA?",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "2",
    sender: "bot",
    text: "Not every cell in the human body contains DNA. DNA is bundled in a cell nucleus. Specifically, mature red blood cells (erythrocytes) lack a cell nucleus. Cornified cells in the skin, hair, and nails contain no nucleus.",
    timestamp: new Date(Date.now() - 3500000).toISOString()
  }
];
