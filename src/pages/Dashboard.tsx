
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import ProgressTracker from "@/components/ProgressTracker";
import StudyTimetable from "@/components/StudyTimetable";
import { 
  BookOpen, 
  MessageSquare, 
  ListChecks, 
  BarChart, 
  Brain, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Calendar,
  User,
  Mail,
  GraduationCap
} from "lucide-react";
import { getTimeOfDay, formatDate } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [studyStreak, setStudyStreak] = useState(8);
  const [completedLessons, setCompletedLessons] = useState(12);
  const [accuracy, setAccuracy] = useState(87);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [iqScore, setIqScore] = useState<number | null>(null);
  
  // User profile information
  const [userProfile, setUserProfile] = useState({
    name: "Haripriya",
    email: "haripriya@example.com",
    course: "NEET"
  });

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    
    // Get IQ score from localStorage
    const storedScore = localStorage.getItem("iqScore");
    if (storedScore) {
      setIqScore(parseInt(storedScore));
    }
    
    // Get selected course from localStorage
    const selectedCourse = localStorage.getItem("selectedCourse");
    if (selectedCourse) {
      setUserProfile(prev => ({
        ...prev,
        course: selectedCourse.toUpperCase()
      }));
    }
    
    // In a real app, you would fetch this data from an API
    // This is just for demo purposes
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const features = [
    {
      title: "AI Practice Quiz",
      description: "Test your knowledge with adaptive quizzes",
      icon: <BookOpen className="text-white" size={24} />,
      color: "bg-brainbridge-purple",
      path: "/quiz",
    },
    {
      title: "AI Study Assistant",
      description: "Ask questions and get instant answers",
      icon: <MessageSquare className="text-white" size={24} />,
      color: "bg-brainbridge-lightpurple",
      path: "/chatbot",
    },
    {
      title: "Study Planner",
      description: "Organize your study sessions",
      icon: <ListChecks className="text-white" size={24} />,
      color: "bg-purple-400",
      path: "/todo",
    },
  ];

  const stats = [
    {
      title: "Study Streak",
      value: studyStreak,
      suffix: "days",
      icon: <TrendingUp size={18} className="text-purple-500" />,
      color: "border-purple-200 bg-purple-50",
    },
    {
      title: "Completed",
      value: completedLessons,
      suffix: "lessons",
      icon: <Clock size={18} className="text-brainbridge-purple" />,
      color: "border-purple-200 bg-purple-50",
    },
    {
      title: "Accuracy",
      value: accuracy,
      suffix: "%",
      icon: <AlertCircle size={18} className="text-purple-500" />,
      color: "border-purple-200 bg-purple-50",
    },
  ];

  const recommended = [
    {
      title: "Cell Biology Advanced Quiz",
      description: "Test your knowledge on cellular structures and functions",
      time: "20 min",
      type: "quiz",
    },
    {
      title: "Genetics Fundamentals",
      description: "Review the principles of inheritance and genetic variation",
      time: "35 min",
      type: "lesson",
    },
    {
      title: "Molecular Biology Practice",
      description: "Practice questions on DNA replication and protein synthesis",
      time: "15 min",
      type: "exercise",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <Navigation />
      
      <div className="pt-24 px-4 pb-16 max-w-6xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Header Section */}
          <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Good {timeOfDay}, {userProfile.name}!
              </h1>
              <p className="text-gray-500 mt-1">
                {formatDate(currentDate)} | Your daily study digest
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-2">
                <Mail size={16} className="text-brainbridge-purple" />
                <span className="text-sm text-gray-600">{userProfile.email}</span>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-2">
                <GraduationCap size={16} className="text-brainbridge-purple" />
                <span className="text-sm text-gray-600">{userProfile.course}</span>
              </div>
            </div>
          </motion.div>

          {/* Progress Tracker */}
          <motion.div variants={item}>
            <ProgressTracker 
              totalCourses={20} 
              completedCourses={completedLessons} 
              averageScore={accuracy} 
              studyHours={24} 
            />
          </motion.div>

          {/* Features Section */}
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Study Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-white rounded-xl shadow-sm cursor-pointer"
                  onClick={() => navigate(feature.path)}
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Dynamic Study Timetable */}
          <motion.div variants={item}>
            <StudyTimetable iqScore={iqScore || undefined} />
          </motion.div>

          {/* Recommended Section */}
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Recommended For You</h2>
            <div className="space-y-3">
              {recommended.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ x: 5 }}
                  className="p-4 bg-white rounded-lg border border-gray-200 cursor-pointer flex items-center"
                  onClick={() => navigate("/quiz")}
                >
                  <div className="mr-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      {item.type === "quiz" ? (
                        <BookOpen size={20} className="text-brainbridge-purple" />
                      ) : item.type === "lesson" ? (
                        <Brain size={20} className="text-brainbridge-purple" />
                      ) : (
                        <BarChart size={20} className="text-purple-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                  <div className="text-xs font-medium text-gray-500 flex items-center">
                    <Clock size={14} className="mr-1" />
                    {item.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
