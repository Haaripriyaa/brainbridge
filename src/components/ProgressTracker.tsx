
import { motion } from "framer-motion";
import { TrendingUp, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface ProgressTrackerProps {
  totalCourses: number;
  completedCourses: number;
  averageScore: number;
  studyHours: number;
  isNewUser?: boolean;
}

const ProgressTracker = ({ 
  totalCourses, 
  completedCourses, 
  averageScore, 
  studyHours,
  isNewUser = false
}: ProgressTrackerProps) => {
  const [progress, setProgress] = useState({
    completedCourses: 0,
    averageScore: 0,
    studyHours: 0
  });
  
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  // Initialize progress either at zero for new users or with provided values
  useEffect(() => {
    if (isNewUser) {
      // Start with zero progress for new users
      setProgress({
        completedCourses: 0,
        averageScore: 0,
        studyHours: 0
      });
      setCompletionPercentage(0);
      
      // After 5 seconds, gradually show actual progress if any
      const timer = setTimeout(() => {
        if (completedCourses > 0) {
          setProgress({
            completedCourses,
            averageScore,
            studyHours
          });
          setCompletionPercentage(Math.round((completedCourses / totalCourses) * 100));
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      // For returning users, show actual progress immediately
      setProgress({
        completedCourses,
        averageScore,
        studyHours
      });
      setCompletionPercentage(Math.round((completedCourses / totalCourses) * 100));
    }
  }, [isNewUser, completedCourses, averageScore, studyHours, totalCourses]);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
        <TrendingUp size={20} className="text-brainbridge-purple" />
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-gray-600">Course Completion</span>
          <span className="text-sm font-medium">{completionPercentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-brainbridge-purple to-brainbridge-lightpurple rounded-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-brainbridge-purple">{progress.completedCourses}/{totalCourses}</span>
            <span className="text-xs text-gray-600 mt-1">Courses</span>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-brainbridge-purple">{progress.averageScore}%</span>
            <span className="text-xs text-gray-600 mt-1">Avg. Score</span>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-purple-600">{progress.studyHours}h</span>
            <span className="text-xs text-gray-600 mt-1">Study Time</span>
          </div>
        </div>
      </div>
      
      {progress.averageScore >= 90 && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg flex items-center">
          <Award size={18} className="text-purple-600 mr-2" />
          <span className="text-sm text-purple-800">Excellent progress! Keep it up!</span>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
