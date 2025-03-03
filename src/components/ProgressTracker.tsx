
import { motion } from "framer-motion";
import { TrendingUp, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getOrCreateUserProgress } from "@/services/progressService";

interface ProgressTrackerProps {
  totalCourses?: number;
  completedCourses?: number;
  averageScore?: number;
  studyHours?: number;
  isNewUser?: boolean;
}

const ProgressTracker = ({ 
  totalCourses: propsTotalCourses, 
  completedCourses: propsCompletedCourses, 
  averageScore: propsAverageScore, 
  studyHours: propsStudyHours,
  isNewUser = false
}: ProgressTrackerProps) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    completedCourses: 0,
    averageScore: 0,
    studyHours: 0,
    totalCourses: 20
  });
  
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user progress from the database or use the props
  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        try {
          const userProgress = await getOrCreateUserProgress(user.id);
          
          if (userProgress) {
            // If we have database progress, use it
            const dbProgress = {
              completedCourses: userProgress.completed_courses,
              averageScore: userProgress.average_score,
              studyHours: userProgress.study_hours,
              totalCourses: userProgress.total_courses
            };
            
            if (isNewUser) {
              // For new users, start with zero progress
              setProgress({
                completedCourses: 0,
                averageScore: 0,
                studyHours: 0,
                totalCourses: dbProgress.totalCourses
              });
              setCompletionPercentage(0);
              
              // After 5 seconds, gradually show actual progress if any
              const timer = setTimeout(() => {
                if (dbProgress.completedCourses > 0) {
                  setProgress(dbProgress);
                  setCompletionPercentage(Math.round((dbProgress.completedCourses / dbProgress.totalCourses) * 100));
                }
              }, 5000);
              
              return () => clearTimeout(timer);
            } else {
              // For returning users, show actual progress immediately
              setProgress(dbProgress);
              setCompletionPercentage(Math.round((dbProgress.completedCourses / dbProgress.totalCourses) * 100));
            }
          } else {
            // Fallback to prop values if database fetch fails
            fallbackToProps();
          }
        } catch (error) {
          console.error("Error fetching user progress:", error);
          fallbackToProps();
        } finally {
          setIsLoading(false);
        }
      } else {
        // If no user, fallback to props
        fallbackToProps();
        setIsLoading(false);
      }
    };
    
    const fallbackToProps = () => {
      const totalCourses = propsTotalCourses || 20;
      const completedCourses = propsCompletedCourses || 0;
      
      if (isNewUser) {
        // Start with zero progress for new users
        setProgress({
          completedCourses: 0,
          averageScore: 0,
          studyHours: 0,
          totalCourses
        });
        setCompletionPercentage(0);
        
        // After 5 seconds, gradually show actual progress if any
        const timer = setTimeout(() => {
          if (completedCourses > 0) {
            setProgress({
              completedCourses,
              averageScore: propsAverageScore || 0,
              studyHours: propsStudyHours || 0,
              totalCourses
            });
            setCompletionPercentage(Math.round((completedCourses / totalCourses) * 100));
          }
        }, 5000);
        
        return () => clearTimeout(timer);
      } else {
        // For returning users, show actual progress immediately
        setProgress({
          completedCourses,
          averageScore: propsAverageScore || 0,
          studyHours: propsStudyHours || 0,
          totalCourses
        });
        setCompletionPercentage(Math.round((completedCourses / totalCourses) * 100));
      }
    };
    
    fetchProgress();
  }, [isNewUser, propsCompletedCourses, propsAverageScore, propsStudyHours, propsTotalCourses, user]);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="h-2.5 bg-gray-200 rounded-full w-full mb-6"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
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
            <span className="text-xl font-bold text-brainbridge-purple">{progress.completedCourses}/{progress.totalCourses}</span>
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
