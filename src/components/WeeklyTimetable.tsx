import { useState, useEffect } from "react";
import { CalendarDays, BookOpen, Brain, Clock, Award, Coffee, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StudySession {
  day: string;
  time: string;
  subject: string;
  duration: number;
  type: "revision" | "focused-study" | "practice" | "quiz" | "break";
  priority: "high" | "medium" | "low";
}

interface TimetableProps {
  quizScores?: Record<string, number>;
}

const WeeklyTimetable = ({ quizScores = {} }: TimetableProps) => {
  const [timetable, setTimetable] = useState<StudySession[]>([]);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const initialExpandedState: Record<string, boolean> = {};
    days.forEach(day => {
      initialExpandedState[day] = false;
    });
    setExpandedDays(initialExpandedState);
    
    const generateTimetable = () => {
      const newTimetable: StudySession[] = [];
      
      const subjects = [
        { name: "Biology Fundamentals", score: quizScores?.biology || 85 },
        { name: "Cellular Functions", score: quizScores?.cellular || 70 }, 
        { name: "Genetics", score: quizScores?.genetics || 60 }, 
        { name: "Anatomy", score: quizScores?.anatomy || 75 }, 
        { name: "Molecular Biology", score: quizScores?.molecular || 65 },
        { name: "Biochemistry", score: quizScores?.biochemistry || 80 },
        { name: "Ecology", score: quizScores?.ecology || 90 }
      ];
      
      const sortedSubjects = [...subjects].sort((a, b) => a.score - b.score);
      
      days.forEach(day => {
        newTimetable.push({
          day,
          time: "08:00 - 09:30 AM",
          subject: sortedSubjects[0].name,
          duration: 90,
          type: "focused-study",
          priority: "high"
        });
        
        newTimetable.push({
          day,
          time: "10:00 - 11:00 AM",
          subject: sortedSubjects[1].name,
          duration: 60,
          type: "practice",
          priority: "high"
        });
        
        newTimetable.push({
          day,
          time: "11:00 - 11:30 AM",
          subject: "Break",
          duration: 30,
          type: "break",
          priority: "medium"
        });
        
        newTimetable.push({
          day,
          time: "11:30 AM - 12:30 PM",
          subject: sortedSubjects[2].name,
          duration: 60,
          type: "revision",
          priority: "medium"
        });
        
        newTimetable.push({
          day,
          time: "12:30 - 01:30 PM",
          subject: "Lunch Break",
          duration: 60,
          type: "break",
          priority: "medium"
        });
        
        newTimetable.push({
          day,
          time: "01:30 - 02:30 PM",
          subject: sortedSubjects[6].name,
          duration: 60,
          type: "revision",
          priority: "low"
        });
        
        newTimetable.push({
          day,
          time: "03:00 - 04:00 PM",
          subject: day === "Friday" ? "Weekly Quiz (All Subjects)" : sortedSubjects[3].name,
          duration: 60,
          type: day === "Friday" ? "quiz" : "practice",
          priority: "medium"
        });
        
        if (day !== "Saturday" && day !== "Sunday") {
          newTimetable.push({
            day,
            time: "04:30 - 05:30 PM",
            subject: sortedSubjects[2].name,
            duration: 60,
            type: "focused-study",
            priority: "high"
          });
        }
      });
      
      return newTimetable;
    };
    
    setTimetable(generateTimetable());
  }, [quizScores]);
  
  const sessionTypeStyles = {
    "focused-study": "bg-red-100 text-red-800 border-red-200",
    "revision": "bg-blue-100 text-blue-800 border-blue-200",
    "practice": "bg-purple-100 text-purple-800 border-purple-200",
    "quiz": "bg-amber-100 text-amber-800 border-amber-200",
    "break": "bg-green-100 text-green-800 border-green-200"
  };
  
  const toggleDay = (day: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  const sessionsByDay = timetable.reduce((acc, session) => {
    if (!acc[session.day]) {
      acc[session.day] = [];
    }
    acc[session.day].push(session);
    return acc;
  }, {} as Record<string, StudySession[]>);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Your Weekly Study Timetable</h3>
        <CalendarDays size={20} className="text-brainbridge-blue" />
      </div>
      
      <div className="space-y-4">
        {Object.entries(sessionsByDay).map(([day, sessions]) => (
          <div key={day} className="border border-gray-100 rounded-lg overflow-hidden">
            <div 
              className="p-3 bg-purple-50 flex items-center justify-between cursor-pointer"
              onClick={() => toggleDay(day)}
            >
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <CalendarDays size={16} className="text-brainbridge-purple" />
                {day}
              </h4>
              {expandedDays[day] ? 
                <ChevronUp size={18} className="text-gray-500" /> : 
                <ChevronDown size={18} className="text-gray-500" />
              }
            </div>
            
            <AnimatePresence>
              {expandedDays[day] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 space-y-2">
                    {sessions.map((session, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg border ${sessionTypeStyles[session.type]} flex items-center justify-between`}
                      >
                        <div className="flex items-center gap-3">
                          {session.type === "break" ? (
                            <Coffee size={18} />
                          ) : session.type === "quiz" ? (
                            <Award size={18} />
                          ) : (
                            <BookOpen size={18} />
                          )}
                          <div>
                            <p className="font-medium">{session.subject}</p>
                            <div className="flex items-center text-sm opacity-80 mt-1">
                              <Clock size={14} className="mr-1" /> 
                              {session.time} ({session.duration} min)
                            </div>
                          </div>
                        </div>
                        
                        {session.type !== "break" && (
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              session.priority === "high" 
                                ? "bg-red-50 text-red-700" 
                                : session.priority === "medium" 
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-green-50 text-green-700"
                            }`}>
                              {session.priority === "high" ? "Focus" : session.priority === "medium" ? "Regular" : "Review"}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-red-200 mr-1"></div>
            Focused Study
          </span>
          <span className="flex items-center text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-blue-200 mr-1"></div>
            Revision
          </span>
          <span className="flex items-center text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-purple-200 mr-1"></div>
            Practice
          </span>
          <span className="flex items-center text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-amber-200 mr-1"></div>
            Quiz
          </span>
          <span className="flex items-center text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-green-200 mr-1"></div>
            Break
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetable;
