
import { ChevronRight } from "lucide-react";
import Button from "@/components/Button";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  canProceed: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  canProceed,
}) => {
  return (
    <div className="flex justify-between mt-6 px-6 pb-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion}
      >
        Previous
      </Button>
      
      <Button
        variant="primary"
        onClick={onNext}
        rightIcon={<ChevronRight size={16} />}
        disabled={!canProceed}
      >
        {isLastQuestion ? "Finish Test" : "Next"}
      </Button>
    </div>
  );
};

export default NavigationButtons;
