import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { toast } from "sonner";
import { Brain, ChevronRight, Clock, Award } from "lucide-react";

interface IQQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index of the correct answer
  image?: string;
}

const IQTest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions: IQQuestion[] = [
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

  useEffect(() => {
    if (!testCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !testCompleted) {
      handleCompleteTest();
    }
  }, [timeLeft, testCompleted]);

  const handleSelectAnswer = (questionId: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleCompleteTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleCompleteTest = () => {
    setTestCompleted(true);
    
    let correctAnswers = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.answer) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = 80 + (correctAnswers / questions.length) * 40;
    setScore(Math.round(calculatedScore));
    setShowResult(true);
  };

  const handleContinueToDashboard = () => {
    localStorage.setItem("iqTestCompleted", "true");
    localStorage.setItem("iqScore", score.toString());
    
    toast.success("IQ test completed! Please select your course.");
    navigate("/course-selection");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg max-w-md w-full p-8"
        >
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto flex items-center justify-center mb-4">
              <Award size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Test Completed!</h2>
            <p className="text-gray-600 mt-2">
              You've completed the initial assessment.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium">Your Result</p>
              <h3 className="text-4xl font-bold text-blue-800 mt-2">{score}</h3>
              <p className="text-gray-600 mt-1">IQ Score</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Correct Answers:</span>
                <span className="font-medium">
                  {Object.keys(selectedAnswers).filter(
                    id => selectedAnswers[parseInt(id)] === questions.find(q => q.id === parseInt(id))?.answer
                  ).length}/{questions.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Time Taken:</span>
                <span className="font-medium">{formatTime(600 - timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Your score has been saved. Now select your course to continue.
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={handleContinueToDashboard}
              className="mt-2"
            >
              Continue to Course Selection
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="text-blue-600" size={24} />
            <h1 className="text-xl font-bold text-blue-600">BrainBridge</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-50 py-1 px-3 rounded-full">
              <Clock size={18} className="text-blue-600" />
              <span className="font-medium text-blue-800">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-grow py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectAnswer(currentQuestion.id, index)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedAnswers[currentQuestion.id] === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      selectedAnswers[currentQuestion.id] === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              <Button
                variant="primary"
                onClick={handleNextQuestion}
                rightIcon={<ChevronRight size={16} />}
                disabled={!(currentQuestion.id in selectedAnswers)}
              >
                {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish Test"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white shadow-sm p-4 mt-auto">
        <div className="max-w-5xl mx-auto text-center text-sm text-gray-600">
          <p>This initial assessment helps us personalize your learning experience.</p>
        </div>
      </footer>
    </div>
  );
};

export default IQTest;
