
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import PageTransition from "./components/PageTransition";
import LoadingScreen from "./components/LoadingScreen";

// Lazy load pages for better performance
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ChatBot = lazy(() => import("./pages/ChatBot"));
const Quiz = lazy(() => import("./pages/Quiz"));
const TodoList = lazy(() => import("./pages/TodoList"));
const Forum = lazy(() => import("./pages/Forum"));
const IQTest = lazy(() => import("./pages/IQTest"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Component to check if IQ test is completed
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
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
            <Route 
              path="/iq-test" 
              element={
                <PageTransition>
                  <IQTest />
                </PageTransition>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chatbot" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <ChatBot />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Quiz />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/todo" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <TodoList />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/forum" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Forum />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
