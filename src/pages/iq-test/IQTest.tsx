
import { motion } from "framer-motion";
import TestHeader from "./components/TestHeader";
import QuestionCard from "./components/QuestionCard";
import NavigationButtons from "./components/NavigationButtons";
import TestFooter from "./components/TestFooter";
import ResultScreen from "./components/ResultScreen";
import { iqTestQuestions } from "./questions";
import { useIQTest } from "./hooks/useIQTest";

const IQTest = () => {
  const {
    currentQuestionIndex,
    selectedAnswers,
    timeLeft,
    showResult,
    score,
    isSaving,
    handleSelectAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleContinueToDashboard,
  } = useIQTest(iqTestQuestions);

  const currentQuestion = iqTestQuestions[currentQuestionIndex];

  if (showResult) {
    return (
      <ResultScreen 
        score={score}
        timeLeft={timeLeft}
        selectedAnswers={selectedAnswers}
        questions={iqTestQuestions}
        isSaving={isSaving}
        onContinue={handleContinueToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <TestHeader 
        timeLeft={timeLeft}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={iqTestQuestions.length}
      />

      <div className="flex-grow py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswers[currentQuestion.id]}
            onSelectAnswer={handleSelectAnswer}
          />

          <NavigationButtons
            onPrevious={handlePreviousQuestion}
            onNext={handleNextQuestion}
            isFirstQuestion={currentQuestionIndex === 0}
            isLastQuestion={currentQuestionIndex === iqTestQuestions.length - 1}
            canProceed={currentQuestion.id in selectedAnswers}
          />
        </div>
      </div>

      <TestFooter />
    </div>
  );
};

export default IQTest;
