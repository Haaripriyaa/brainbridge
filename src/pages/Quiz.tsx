
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Button from "@/components/Button";
import { ArrowLeft, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { sampleQuizData } from "@/lib/utils";
import { toast } from "sonner";

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation?: string;
  image?: string;
}

type QuizStatus = "intro" | "active" | "result";

const Quiz = () => {
  const navigate = useNavigate();
  const [quizStatus, setQuizStatus] = useState<QuizStatus>("intro");
  const [questions] = useState<QuizQuestion[]>(sampleQuizData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleStartQuiz = () => {
    setQuizStatus("active");
  };

  const handleSelectAnswer = (answerId: string) => {
    if (showExplanation) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answerId
    });
    
    setShowExplanation(true);
    
    // Update score if correct
    if (answerId === currentQuestion.correctAnswer) {
      setQuizScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizStatus("result");
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(!!selectedAnswers[questions[currentQuestionIndex - 1].id]);
    }
  };

  const handleRestartQuiz = () => {
    setQuizStatus("intro");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setQuizScore(0);
  };

  const isOptionSelected = (questionId: number, optionId: string) => {
    return selectedAnswers[questionId] === optionId;
  };

  const isCorrectAnswer = (optionId: string) => {
    return currentQuestion.correctAnswer === optionId;
  };

  const isIncorrectSelection = (questionId: number, optionId: string) => {
    return showExplanation && 
           isOptionSelected(questionId, optionId) && 
           !isCorrectAnswer(optionId);
  };

  const renderQuizIntro = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-brainbridge-darkpurple min-h-screen flex flex-col items-center justify-center p-6"
    >
      <div className="text-center max-w-md">
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4"
          >
            QUIZ
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-1"
          >
            {[1, 2, 3].map((_, i) => (
              <div 
                key={i}
                className="w-5 h-5 rounded-full border-2 border-pink-400 flex items-center justify-center"
              >
                <X size={12} className="text-pink-400" />
              </div>
            ))}
          </motion.div>
        </div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white text-2xl font-bold mb-2"
        >
          Let's Play!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-300 mb-8"
        >
          Enhance your knowledge with our AI-powered quiz
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartQuiz}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            Play Now
          </Button>
          
          <button
            onClick={() => window.history.back()}
            className="mt-4 text-gray-400 hover:text-white transition-colors"
          >
            About
          </button>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderQuizActive = () => (
    <div className="min-h-screen bg-brainbridge-navy">
      <Navigation />
      
      <div className="pt-16 pb-8 px-4 max-w-3xl mx-auto min-h-screen flex flex-col">
        {/* Quiz Header */}
        <div className="flex items-center justify-between py-4">
          <button 
            onClick={() => window.history.back()}
            className="p-2 rounded-full bg-blue-900/30 text-white hover:bg-blue-800/50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="text-center">
            <h2 className="text-white font-medium">Level 5</h2>
            <div className="flex space-x-1 mt-1">
              {Array.from({ length: questions.length }).map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 w-5 rounded-full ${
                    index === currentQuestionIndex
                      ? 'bg-white'
                      : index < currentQuestionIndex
                        ? 'bg-green-400'
                        : 'bg-blue-900/50'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="p-2 rounded-full bg-blue-900/30 text-white">
            <span className="font-bold">{currentQuestionIndex + 1}</span>
            <span className="text-blue-200">/{questions.length}</span>
          </div>
        </div>
        
        {/* Question */}
        <div className="mt-4 mb-6">
          <h3 className="text-white text-xl font-medium">
            Q.{currentQuestionIndex + 1} {currentQuestion.question}
          </h3>
        </div>
        
        {/* Image if available */}
        {currentQuestion.image && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img 
              src={currentQuestion.image} 
              alt="Question visual" 
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        
        {/* Options */}
        <div className="space-y-3 flex-1">
          {currentQuestion.options.map((option) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={!showExplanation ? { scale: 1.02 } : {}}
              onClick={() => handleSelectAnswer(option.id)}
              disabled={showExplanation}
              className={`w-full p-4 rounded-lg flex items-center justify-between text-left transition-colors ${
                showExplanation && isCorrectAnswer(option.id)
                  ? 'bg-green-500 text-white'
                  : isIncorrectSelection(currentQuestion.id, option.id)
                    ? 'bg-red-500 text-white'
                    : isOptionSelected(currentQuestion.id, option.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-900/30 text-white hover:bg-blue-800/50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${
                  showExplanation && isCorrectAnswer(option.id)
                    ? 'bg-green-600'
                    : isIncorrectSelection(currentQuestion.id, option.id)
                      ? 'bg-red-600'
                      : 'bg-blue-800/50'
                }`}>
                  {option.id}
                </div>
                <span>{option.text}</span>
              </div>
              
              {showExplanation && (
                isCorrectAnswer(option.id) ? (
                  <Check size={20} className="text-white" />
                ) : isIncorrectSelection(currentQuestion.id, option.id) ? (
                  <X size={20} className="text-white" />
                ) : null
              )}
            </motion.button>
          ))}
        </div>
        
        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 p-4 bg-blue-900/40 rounded-lg border border-blue-700/50"
            >
              <h4 className="text-blue-200 font-medium mb-1">Explanation:</h4>
              <p className="text-white text-sm">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            leftIcon={<ChevronLeft size={18} />}
            className="text-white disabled:opacity-50"
          >
            Previous
          </Button>
          
          {showExplanation && (
            <Button
              variant="primary"
              onClick={handleNextQuestion}
              rightIcon={<ChevronRight size={18} />}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'See Results'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderQuizResult = () => (
    <div className="min-h-screen bg-brainbridge-navy flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-blue-900/30 rounded-xl p-8 text-center"
      >
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring",
              duration: 0.8 
            }}
            className="w-28 h-28 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 mx-auto flex items-center justify-center"
          >
            <span className="text-3xl font-bold text-white">
              {Math.round((quizScore / questions.length) * 100)}%
            </span>
          </motion.div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          Quiz Completed!
        </h2>
        
        <p className="text-blue-200 mb-6">
          You answered {quizScore} out of {questions.length} questions correctly.
        </p>
        
        <div className="space-y-3 mb-8">
          <div className="flex justify-between items-center py-2 border-b border-blue-800/50">
            <span className="text-blue-200">Total Questions</span>
            <span className="text-white font-medium">{questions.length}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-blue-800/50">
            <span className="text-blue-200">Correct Answers</span>
            <span className="text-green-400 font-medium">{quizScore}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-blue-800/50">
            <span className="text-blue-200">Incorrect Answers</span>
            <span className="text-red-400 font-medium">{questions.length - quizScore}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-blue-200">Accuracy</span>
            <span className="text-white font-medium">
              {Math.round((quizScore / questions.length) * 100)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={handleRestartQuiz}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            Play Again
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/dashboard')}
            className="border-blue-500 text-blue-300 hover:bg-blue-800/30"
          >
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {quizStatus === "intro" && renderQuizIntro()}
      {quizStatus === "active" && renderQuizActive()}
      {quizStatus === "result" && renderQuizResult()}
    </AnimatePresence>
  );
};

export default Quiz;
