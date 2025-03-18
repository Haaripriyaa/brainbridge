
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { useEffect, useState } from "react";
import { getOrCreateUserProgress } from "@/services/progressService";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const [isCheckingProgress, setIsCheckingProgress] = useState(true);
  const [isIqTestCompleted, setIsIqTestCompleted] = useState(false);
  const [hasSelectedCourse, setHasSelectedCourse] = useState(false);

  useEffect(() => {
    const checkUserProgress = async () => {
      if (user) {
        try {
          // Try to get progress from database first
          const progress = await getOrCreateUserProgress(user.id);
          
          // If we have IQ score in database, mark IQ test as completed
          if (progress && progress.iq_score !== null && progress.iq_score !== undefined) {
            localStorage.setItem("iqTestCompleted", "true");
            setIsIqTestCompleted(true);
          } else {
            // Check localStorage as fallback
            setIsIqTestCompleted(localStorage.getItem("iqTestCompleted") === "true");
          }
          
          // If we have selected course in database, mark course as selected
          if (progress && progress.selected_course) {
            localStorage.setItem("selectedCourse", progress.selected_course);
            setHasSelectedCourse(true);
          } else {
            // Check localStorage as fallback
            setHasSelectedCourse(!!localStorage.getItem("selectedCourse"));
          }
        } catch (error) {
          console.error("Error checking user progress:", error);
          // Fallback to localStorage if database check fails
          setIsIqTestCompleted(localStorage.getItem("iqTestCompleted") === "true");
          setHasSelectedCourse(!!localStorage.getItem("selectedCourse"));
        }
      }
      
      setIsCheckingProgress(false);
    };
    
    if (!isLoading && user) {
      checkUserProgress();
    } else if (!isLoading) {
      setIsCheckingProgress(false);
    }
  }, [user, isLoading]);

  if (isLoading || isCheckingProgress) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Get the current path
  const path = window.location.pathname;
  
  // If the user hasn't completed the IQ test and isn't already on the IQ test page,
  // redirect them to the IQ test
  if (!isIqTestCompleted && path !== "/iq-test") {
    return <Navigate to="/iq-test" replace />;
  }
  
  // If the user has completed the IQ test but hasn't selected a course
  // and isn't already on the course selection page, redirect them to course selection
  if (isIqTestCompleted && !hasSelectedCourse && 
      path !== "/course-selection" && path !== "/iq-test") {
    return <Navigate to="/course-selection" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
