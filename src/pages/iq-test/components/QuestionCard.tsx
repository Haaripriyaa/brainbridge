
import { IQQuestion } from "../types";

interface QuestionCardProps {
  question: IQQuestion;
  selectedAnswer: number | undefined;
  onSelectAnswer: (questionId: number, answerIndex: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
}) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {question.question}
      </h2>

      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <div
            key={index}
            onClick={() => onSelectAnswer(question.id, index)}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedAnswer === index
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                selectedAnswer === index
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
    </div>
  );
};

export default QuestionCard;
