
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import PageTransition from "./components/PageTransition";
import LoadingScreen from "./components/LoadingScreen";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages for better performance
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ChatBot = lazy(() => import("./pages/ChatBot"));
const Quiz = lazy(() => import("./pages/Quiz"));
const TodoList = lazy(() => import("./pages/TodoList"));
const Forum = lazy(() => import("./pages/Forum"));
const Profile = lazy(() => import("./pages/Profile"));
const IQTest = lazy(() => import("./pages/IQTest"));
const CourseSelection = lazy(() => import("./pages/CourseSelection"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Component to check if IQ test has been completed for new users
const RequireIQTest = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  
  useEffect(() => {
    // Check if IQ test is completed in localStorage
    const testCompleted = localStorage.getItem("iqTestCompleted") === "true";
    setIsTestCompleted(testCompleted);
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // If test is not completed and user is trying to access other pages, redirect to IQ test
  if (!isTestCompleted) {
    return <Navigate to="/iq-test" replace />;
  }
  
  return <>{children}</>;
};

// Component to check if course selection has been completed
const RequireCourseSelection = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCourseSelected, setIsCourseSelected] = useState(false);
  
  useEffect(() => {
    // Check if course is selected in localStorage
    const selectedCourse = localStorage.getItem("selectedCourse");
    setIsCourseSelected(!!selectedCourse);
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // If course is not selected and user is trying to access other pages, redirect to course selection
  if (!isCourseSelected) {
    return <Navigate to="/course-selection" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <PageTransition>
                    <Onboarding />
                  </PageTransition>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PageTransition>
                    <Register />
                  </PageTransition>
                } 
              />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route 
                  path="/iq-test" 
                  element={
                    <PageTransition>
                      <IQTest />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/course-selection" 
                  element={
                    <RequireIQTest>
                      <PageTransition>
                        <CourseSelection />
                      </PageTransition>
                    </RequireIQTest>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <RequireIQTest>
                      <RequireCourseSelection>
                        <PageTransition>
                          <Dashboard />
                        </PageTransition>
                      </RequireCourseSelection>
                    </RequireIQTest>
                  } 
                />
                <Route 
                  path="/chatbot" 
                  element={
                    <RequireIQTest>
                      <RequireCourseSelection>
                        <PageTransition>
                          <ChatBot />
                        </PageTransition>
                      </RequireCourseSelection>
                    </RequireIQTest>
                  } 
                />
                <Route 
                  path="/quiz" 
                  element={
                    <RequireIQTest>
                      <RequireCourseSelection>
                        <PageTransition>
                          <Quiz />
                        </PageTransition>
                      </RequireCourseSelection>
                    </RequireIQTest>
                  } 
                />
                <Route 
                  path="/todo" 
                  element={
                    <RequireIQTest>
                      <RequireCourseSelection>
                        <PageTransition>
                          <TodoList />
                        </PageTransition>
                      </RequireCourseSelection>
                    </RequireIQTest>
                  } 
                />
                <Route 
                  path="/forum" 
                  element={
                    <RequireIQTest>
                      <RequireCourseSelection>
                        <PageTransition>
                          <Forum />
                        </PageTransition>
                      </RequireCourseSelection>
                    </RequireIQTest>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <RequireIQTest>
                      <RequireCourseSelection>
                        <PageTransition>
                          <Profile />
                        </PageTransition>
                      </RequireCourseSelection>
                    </RequireIQTest>
                  } 
                />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
