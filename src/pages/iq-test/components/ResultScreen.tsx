
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import Button from "@/components/Button";
import { formatTime } from "../utils";
import { IQQuestion } from "../types";

interface ResultScreenProps {
  score: number;
  timeLeft: number;
  selectedAnswers: Record<number, number>;
  questions: IQQuestion[];
  isSaving: boolean;
  onContinue: () => Promise<void>;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  timeLeft,
  selectedAnswers,
  questions,
  isSaving,
  onContinue,
}) => {
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
            onClick={onContinue}
            isLoading={isSaving}
            className="mt-2"
          >
            Continue to Course Selection
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultScreen;
