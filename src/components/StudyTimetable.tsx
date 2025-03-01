
import { useState, useEffect } from "react";
import { CalendarDays, BookOpen, Brain, Clock } from "lucide-react";

interface StudySession {
  day: string;
  time: string;
  subject: string;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
}

interface StudyTimetableProps {
  iqScore?: number;
}

const StudyTimetable = ({ iqScore = 100 }: StudyTimetableProps) => {
  const [timetable, setTimetable] = useState<StudySession[]>([]);
  
  // Generate a dynamic timetable based on the IQ score
  useEffect(() => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    // Determine focus areas and intensity based on IQ score
    const generateTimetable = () => {
      const newTimetable: StudySession[] = [];
      
      // Higher IQ scores get more challenging schedules with more sessions
      const sessionsPerWeek = iqScore < 90 ? 3 : iqScore < 110 ? 4 : 5;
      
      // Different subjects to study
      const subjects = [
        "Biology Fundamentals", 
        "Cellular Functions", 
        "Genetics", 
        "Anatomy", 
        "Molecular Biology",
        "Biochemistry",
        "Ecology"
      ];
      
      // Select random days (but ensure they're evenly distributed)
      const selectedDays = [...days].sort(() => 0.5 - Math.random()).slice(0, sessionsPerWeek);
      
      // Create sessions based on IQ score
      selectedDays.forEach((day, index) => {
        // Higher IQ scores get harder topics and shorter, more intense sessions
        const difficultyLevel = iqScore < 90 
          ? "easy" 
          : iqScore < 110 
            ? (index % 2 === 0 ? "medium" : "easy")
            : (index % 3 === 0 ? "hard" : index % 3 === 1 ? "medium" : "easy");
        
        // Duration is shorter for higher IQ (they learn faster)
        const duration = iqScore < 90 
          ? 60 
          : iqScore < 110 
            ? 45
            : 30;
        
        // Subject rotation based on index
        const subject = subjects[index % subjects.length];
        
        // Time of day - distribute throughout the day
        const hours = [
          "08:00 AM", 
          "10:30 AM", 
          "02:00 PM", 
          "04:30 PM", 
          "07:00 PM"
        ];
        const time = hours[index % hours.length];
        
        newTimetable.push({
          day,
          time,
          subject,
          duration,
          difficulty: difficultyLevel as "easy" | "medium" | "hard"
        });
      });
      
      return newTimetable;
    };
    
    setTimetable(generateTimetable());
  }, [iqScore]);
  
  // Map difficulty to colors
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Your Personalized Study Schedule</h3>
        <CalendarDays size={20} className="text-brainbridge-blue" />
      </div>
      
      <div className="space-y-3">
        {timetable.map((session, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen size={18} className="text-brainbridge-blue" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{session.subject}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span className="flex items-center mr-3">
                    <CalendarDays size={14} className="mr-1" /> {session.day}
                  </span>
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" /> {session.time}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">{session.duration} min</span>
              <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[session.difficulty]}`}>
                {session.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Brain size={16} className="mr-1 text-brainbridge-purple" /> 
          <span>Schedule optimized for your learning style</span>
        </div>
      </div>
    </div>
  );
};

export default StudyTimetable;
