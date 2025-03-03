
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { ArrowLeft, CheckCircle, XCircle, Info } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const quizData: Question[] = [
  {
    id: 1,
    text: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Endoplasmic Reticulum", "Golgi Apparatus"],
    correctAnswer: "Mitochondria",
    explanation: "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's supply of ATP, used as a source of chemical energy."
  },
  {
    id: 2,
    text: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Carbon Dioxide",
    explanation: "Plants absorb carbon dioxide from the atmosphere during photosynthesis to produce glucose and oxygen."
  },
  {
    id: 3,
    text: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "NaCl", "O2"],
    correctAnswer: "H2O",
    explanation: "H2O is the chemical formula for water, consisting of two hydrogen atoms and one oxygen atom."
  },
  {
    id: 4,
    text: "Which of the following is NOT a type of blood cell?",
    options: ["Red blood cell", "White blood cell", "Platelet", "Hepatocyte"],
    correctAnswer: "Hepatocyte",
    explanation: "Hepatocytes are liver cells, not blood cells. The three types of blood cells are red blood cells, white blood cells, and platelets."
  },
  {
    id: 5,
    text: "What is the largest organ in the human body?",
    options: ["Heart", "Liver", "Skin", "Brain"],
    correctAnswer: "Skin",
    explanation: "The skin is the largest organ in the human body, covering approximately 20 square feet for an average adult."
  },
  {
    id: 6,
    text: "What is the primary function of insulin in the body?",
    options: ["Increase blood glucose", "Decrease blood glucose", "Increase protein synthesis", "Break down fats"],
    correctAnswer: "Decrease blood glucose",
    explanation: "Insulin is a hormone that allows cells to absorb glucose from the bloodstream, thereby decreasing blood glucose levels."
  },
  {
    id: 7,
    text: "Which of the following is not a base in DNA?",
    options: ["Adenine", "Uracil", "Guanine", "Cytosine"],
    correctAnswer: "Uracil",
    explanation: "Uracil is a base found in RNA, not DNA. The four bases in DNA are Adenine, Thymine, Guanine, and Cytosine."
  },
  {
    id: 8,
    text: "What is the main function of the kidneys?",
    options: ["Filter blood", "Produce hormones", "Store waste", "Digest food"],
    correctAnswer: "Filter blood",
    explanation: "The primary function of the kidneys is to filter blood, removing waste and excess substances that are then excreted as urine."
  },
  {
    id: 9,
    text: "What is the process by which plants make their own food called?",
    options: ["Respiration", "Photosynthesis", "Fermentation", "Digestion"],
    correctAnswer: "Photosynthesis",
    explanation: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water."
  },
  {
    id: 10,
    text: "Which vitamin is produced when the skin is exposed to sunlight?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
    correctAnswer: "Vitamin D",
    explanation: "When skin is exposed to sunlight, it produces vitamin D, which is essential for calcium absorption and bone health."
  }
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [attemptedQuestions, setAttemptedQuestions] = useState<number[]>([]);

  useEffect(() => {
    // Store quiz completion status in localStorage
    if (quizCompleted) {
      localStorage.setItem("quizCompleted", "true");
      // Update progress in localStorage
      const completedCourses = parseInt(localStorage.getItem("completedCourses") || "0");
      localStorage.setItem("completedCourses", (completedCourses + 1).toString());
      
      // Update study hours
      const studyHours = parseInt(localStorage.getItem("studyHours") || "0");
      localStorage.setItem("studyHours", (studyHours + 1).toString());
      
      // Update average score
      const currentAvgScore = parseInt(localStorage.getItem("averageScore") || "0");
      const totalQuizzes = parseInt(localStorage.getItem("totalQuizzes") || "0");
      const newAvgScore = Math.round(((currentAvgScore * totalQuizzes) + score) / (totalQuizzes + 1));
      localStorage.setItem("averageScore", newAvgScore.toString());
      localStorage.setItem("totalQuizzes", (totalQuizzes + 1).toString());
    }
  }, [quizCompleted, score]);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    // Record the answer
    setAnswers({
      ...answers,
      [currentQuestion]: selectedAnswer || ""
    });
    
    // Mark question as attempted
    if (!attemptedQuestions.includes(currentQuestion)) {
      setAttemptedQuestions([...attemptedQuestions, currentQuestion]);
    }
    
    // Calculate score
    if (selectedAnswer === quizData[currentQuestion].correctAnswer && !attemptedQuestions.includes(currentQuestion)) {
      setScore(score + 1);
    }
    
    setShowExplanation(false);
    setSelectedAnswer(null);

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
      toast.success("Quiz completed!");
    }
  };

  const handleShowExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="back" 
              leftIcon={<ArrowLeft size={20} />}
              onClick={() => navigate("/dashboard")}
              aria-label="Back to Dashboard"
            />
          </div>
          <div className="flex items-center">
            <div onClick={() => navigate("/dashboard")} className="cursor-pointer">
              <Logo size="sm" showText={true} />
            </div>
          </div>
          <div className="w-[100px]"></div> {/* Empty div to balance the header */}
        </div>
      </header>

      <div className="pt-24 px-4 pb-16 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {/* Quiz Header */}
          <div className="p-6 bg-gradient-to-r from-brainbridge-purple to-brainbridge-lightpurple">
            <h1 className="text-2xl font-bold text-white">AI Practice Quiz</h1>
            <p className="text-blue-100 mt-1">Test your knowledge with adaptive quizzes</p>
          </div>

          {/* Quiz Content */}
          <div className="p-6">
            {!quizCompleted ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Question {currentQuestion + 1}/{quizData.length}
                  </h2>
                  <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    Score: {score}/{attemptedQuestions.length}
                  </span>
                </div>
                <p className="text-gray-600">{quizData[currentQuestion].text}</p>

                {/* Options */}
                <div className="space-y-2">
                  {quizData[currentQuestion].options.map((option) => {
                    const isCorrect = option === quizData[currentQuestion].correctAnswer;
                    const isSelected = selectedAnswer === option;
                    
                    let optionClass = "w-full p-3 rounded-lg border ";
                    
                    if (showExplanation) {
                      if (isCorrect) {
                        optionClass += "bg-green-100 border-green-500 text-green-800";
                      } else if (isSelected && !isCorrect) {
                        optionClass += "bg-red-100 border-red-500 text-red-800";
                      } else {
                        optionClass += "bg-white text-gray-800 border-gray-200";
                      }
                    } else {
                      optionClass += isSelected 
                        ? "bg-purple-500 text-white border-purple-500" 
                        : "bg-white text-gray-800 border-gray-200 hover:bg-purple-100 hover:border-purple-300";
                    }

                    return (
                      <button
                        key={option}
                        className={optionClass}
                        onClick={() => handleAnswerSelection(option)}
                        disabled={showExplanation}
                      >
                        <div className="flex items-center">
                          {showExplanation && isCorrect && (
                            <CheckCircle size={18} className="text-green-600 mr-2" />
                          )}
                          {showExplanation && isSelected && !isCorrect && (
                            <XCircle size={18} className="text-red-600 mr-2" />
                          )}
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                    <div className="flex items-start">
                      <Info size={20} className="text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Explanation</p>
                        <p className="text-sm text-blue-700 mt-1">
                          {quizData[currentQuestion].explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quiz Controls */}
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={handleShowExplanation}
                    disabled={!selectedAnswer}
                    leftIcon={<Info size={16} />}
                  >
                    {showExplanation ? "Hide Explanation" : "Show Explanation"}
                  </Button>
                  
                  <Button
                    variant="primary"
                    fullWidth
                    disabled={!selectedAnswer}
                    onClick={handleNextQuestion}
                  >
                    {currentQuestion === quizData.length - 1 ? "Finish Quiz" : "Next Question"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Results</h2>
                <div className="mb-6">
                  <div className="w-28 h-28 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-center">
                      <span className="block text-3xl font-bold text-purple-700">{score}</span>
                      <span className="text-sm text-purple-600">out of {quizData.length}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    You scored {score} out of {quizData.length} questions correctly!
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-medium text-gray-800 mb-3">Question Review</h3>
                  <div className="space-y-4">
                    {quizData.map((question, index) => {
                      const userAnswer = answers[index] || "Not answered";
                      const isCorrect = userAnswer === question.correctAnswer;
                      
                      return (
                        <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                          <p className="font-medium text-gray-700 mb-1">
                            Q{index + 1}: {question.text}
                          </p>
                          <div className="flex items-center">
                            <span className="text-sm mr-2">Your answer:</span>
                            <span className={`text-sm font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                              {userAnswer}
                              {isCorrect ? 
                                <CheckCircle size={14} className="inline ml-1 text-green-600" /> : 
                                <XCircle size={14} className="inline ml-1 text-red-600" />
                              }
                            </span>
                          </div>
                          {!isCorrect && (
                            <p className="text-sm text-green-700">
                              Correct answer: {question.correctAnswer}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <Button 
                  variant="primary" 
                  onClick={() => navigate("/dashboard")}
                  className="mt-4"
                >
                  Return to Dashboard
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Quiz;

