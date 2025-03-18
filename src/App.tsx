
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
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
                    <PageTransition>
                      <CourseSelection />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <PageTransition>
                      <Dashboard />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/chatbot" 
                  element={
                    <PageTransition>
                      <ChatBot />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/quiz" 
                  element={
                    <PageTransition>
                      <Quiz />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/todo" 
                  element={
                    <PageTransition>
                      <TodoList />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/forum" 
                  element={
                    <PageTransition>
                      <Forum />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PageTransition>
                      <Profile />
                    </PageTransition>
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
