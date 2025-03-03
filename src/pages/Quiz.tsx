import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

const quizData: Question[] = [
  {
    id: 1,
    text: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Endoplasmic Reticulum", "Golgi Apparatus"],
    correctAnswer: "Mitochondria",
  },
  {
    id: 2,
    text: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Carbon Dioxide",
  },
  {
    id: 3,
    text: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "NaCl", "O2"],
    correctAnswer: "H2O",
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    // Store quiz completion status in localStorage
    if (quizCompleted) {
      localStorage.setItem("iqTestCompleted", "true");
    }
  }, [quizCompleted]);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setSelectedAnswer(null);

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
      toast.success("Quiz completed!");

      // Store the score in localStorage
      localStorage.setItem("quizScore", score.toString());

      // Redirect to course selection page
      navigate("/course-selection");
    }
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
                <h2 className="text-lg font-semibold text-gray-800">
                  Question {currentQuestion + 1}/{quizData.length}
                </h2>
                <p className="text-gray-600">{quizData[currentQuestion].text}</p>

                {/* Options */}
                <div className="space-y-2">
                  {quizData[currentQuestion].options.map((option) => (
                    <button
                      key={option}
                      className={`w-full p-3 rounded-lg border ${
                        selectedAnswer === option
                          ? "bg-purple-500 text-white border-purple-500"
                          : "bg-white text-gray-800 border-gray-200"
                      } hover:bg-purple-100 hover:border-purple-300 transition-colors`}
                      onClick={() => handleAnswerSelection(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Next Question Button */}
                <Button
                  variant="primary"
                  fullWidth
                  disabled={!selectedAnswer}
                  onClick={handleNextQuestion}
                >
                  {currentQuestion === quizData.length - 1 ? "Finish Quiz" : "Next Question"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
                <p className="text-gray-600 mb-6">
                  Your Score: {score}/{quizData.length}
                </p>
                <Button variant="primary" onClick={() => navigate("/course-selection")}>
                  Continue to Course Selection
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
