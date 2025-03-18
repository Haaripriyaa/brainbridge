
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if IQ test is completed from localStorage
  const isIqTestCompleted = localStorage.getItem("iqTestCompleted") === "true";
  
  // Get the current path
  const path = window.location.pathname;
  
  // If the user hasn't completed the IQ test and isn't already on the IQ test page,
  // redirect them to the IQ test
  if (!isIqTestCompleted && path !== "/iq-test") {
    return <Navigate to="/iq-test" replace />;
  }
  
  // If the user has completed the IQ test but hasn't selected a course
  // and isn't already on the course selection page, redirect them to course selection
  const hasSelectedCourse = localStorage.getItem("selectedCourse");
  if (isIqTestCompleted && !hasSelectedCourse && 
      path !== "/course-selection" && path !== "/iq-test") {
    return <Navigate to="/course-selection" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
