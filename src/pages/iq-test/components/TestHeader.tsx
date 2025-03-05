
import { Brain, Clock } from "lucide-react";
import { formatTime } from "../utils";

interface TestHeaderProps {
  timeLeft: number;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const TestHeader: React.FC<TestHeaderProps> = ({
  timeLeft,
  currentQuestionIndex,
  totalQuestions,
}) => {
  return (
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
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TestHeader;
