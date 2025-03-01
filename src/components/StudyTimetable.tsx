
import { useState, useEffect } from "react";
import WeeklyTimetable from "./WeeklyTimetable";

interface StudyTimetableProps {
  iqScore?: number;
}

const StudyTimetable = ({ iqScore = 100 }: StudyTimetableProps) => {
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  
  // Generate quiz scores based on IQ score for dynamic timetable
  useEffect(() => {
    // Use IQ score to determine distribution of subject strengths/weaknesses
    // Higher IQ = more even distribution, lower IQ = more variance
    const generateScores = () => {
      const variance = Math.max(5, 30 - (iqScore - 80) / 2); // Less variance for higher IQ
      
      const baseScore = Math.min(85, Math.max(60, iqScore - 15)); // Base score derived from IQ
      
      // Generate random scores for each subject with appropriate variance
      return {
        biology: Math.min(100, Math.max(50, baseScore + (Math.random() - 0.5) * variance)),
        cellular: Math.min(100, Math.max(50, baseScore + (Math.random() - 0.5) * variance)),
        genetics: Math.min(100, Math.max(50, baseScore + (Math.random() - 0.5) * variance)),
        anatomy: Math.min(100, Math.max(50, baseScore + (Math.random() - 0.5) * variance)),
        molecular: Math.min(100, Math.max(50, baseScore + (Math.random() - 0.5) * variance)),
        biochemistry: Math.min(100, Math.max(50, baseScore + (Math.random() - 0.5) * variance)),
        ecology: Math.min(100, Math.max(50, baseScore + (Math.random() - 0.5) * variance))
      };
    };
    
    setQuizScores(generateScores());
  }, [iqScore]);
  
  return <WeeklyTimetable quizScores={quizScores} />;
};

export default StudyTimetable;
