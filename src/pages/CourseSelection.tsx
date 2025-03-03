
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { BookOpen, GraduationCap, Lightbulb, Code, Globe } from "lucide-react";
import { toast } from "sonner";

const CourseSelection = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const courses = [
    {
      id: "neet",
      name: "NEET",
      description: "National Eligibility cum Entrance Test for Medical Programs",
      icon: <BookOpen size={24} className="text-white" />,
      color: "bg-purple-600"
    },
    {
      id: "jee",
      name: "JEE",
      description: "Joint Entrance Examination for Engineering Programs",
      icon: <Code size={24} className="text-white" />,
      color: "bg-purple-500"
    },
    {
      id: "gre",
      name: "GRE",
      description: "Graduate Record Examination for Graduate Studies",
      icon: <GraduationCap size={24} className="text-white" />,
      color: "bg-purple-700"
    },
    {
      id: "gate",
      name: "GATE",
      description: "Graduate Aptitude Test in Engineering",
      icon: <Lightbulb size={24} className="text-white" />,
      color: "bg-purple-800"
    },
    {
      id: "toefl",
      name: "TOEFL",
      description: "Test of English as a Foreign Language",
      icon: <Globe size={24} className="text-white" />,
      color: "bg-purple-400"
    }
  ];

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
  };

  const handleContinue = () => {
    if (!selectedCourse) {
      toast.error("Please select a course to continue");
      return;
    }
    
    // Save the selected course to localStorage
    localStorage.setItem("selectedCourse", selectedCourse);
    
    toast.success(`You've selected ${courses.find(c => c.id === selectedCourse)?.name}!`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <Logo size="md" showText={true} />
          <h1 className="text-2xl font-bold text-gray-800 mt-6">Choose Your Course</h1>
          <p className="text-gray-600 mt-2">
            Select the course you're preparing for to personalize your learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedCourse === course.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
              onClick={() => handleCourseSelect(course.id)}
            >
              <div className="flex items-start">
                <div className={`${course.color} w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
                  {course.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{course.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleContinue}
            className="bg-brainbridge-purple hover:bg-brainbridge-lightpurple"
          >
            Continue to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseSelection;
