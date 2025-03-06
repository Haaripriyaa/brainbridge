
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { saveIQTestResults } from "@/services/progressService";
import { IQQuestion } from "../types";
import { calculateIQScore } from "../utils";

export const useIQTest = (questions: IQQuestion[]) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if the test has already been completed when the component loads
  useEffect(() => {
    const iqTestCompleted = localStorage.getItem("iqTestCompleted") === "true";
    const existingScore = localStorage.getItem("iqScore");
    
    if (iqTestCompleted && existingScore) {
      // If the test is already completed, redirect to course selection
      navigate("/course-selection");
    }
  }, [navigate]);

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
    
    const roundedScore = calculateIQScore(correctAnswers, questions.length);
    setScore(roundedScore);
    setShowResult(true);
    
    localStorage.setItem("iqTestCompleted", "true");
    localStorage.setItem("iqScore", roundedScore.toString());
  };

  const handleContinueToDashboard = async () => {
    setIsSaving(true);
    
    try {
      if (user) {
        await saveIQTestResults(user.id, score);
      }
      
      toast.success("IQ test completed! Please select your course.");
      navigate("/course-selection");
    } catch (error) {
      console.error("Error saving IQ test results:", error);
      toast.error("Failed to save results, but you can still continue");
      navigate("/course-selection");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    currentQuestionIndex,
    selectedAnswers,
    timeLeft,
    testCompleted,
    score,
    showResult,
    isSaving,
    handleSelectAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleCompleteTest,
    handleContinueToDashboard,
  };
};
