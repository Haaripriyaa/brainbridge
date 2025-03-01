
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { User, Mail, GraduationCap, Calendar, Award, ArrowLeft, Clock } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    course: "Biology",
    joinDate: "March 15, 2023",
    iqScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating API call with timeout
    const timer = setTimeout(() => {
      const storedIqScore = localStorage.getItem("iqScore");
      
      setUserProfile(prev => ({
        ...prev,
        iqScore: storedIqScore ? parseInt(storedIqScore) : 105
      }));
      
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateProfile = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="back" 
              size="sm" 
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate("/dashboard")}
              className="mr-4"
            >
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center">
            <div onClick={() => navigate("/dashboard")} className="cursor-pointer">
              <Logo size="sm" showText={true} />
            </div>
          </div>
          <div className="w-[100px]"></div> {/* Empty div to balance the header */}
        </div>
      </header>
      
      <div className="pt-24 pb-10 px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
      
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brainbridge-blue to-brainbridge-purple flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {userProfile.name.charAt(0)}
                </div>
                
                <div className="w-full bg-blue-50 rounded-lg p-4 mt-4">
                  <h3 className="text-lg font-semibold text-center mb-2">IQ Score</h3>
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-white border-4 border-brainbridge-blue flex items-center justify-center">
                      <span className="text-2xl font-bold text-brainbridge-blue">
                        {isLoading ? "..." : userProfile.iqScore}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="text-brainbridge-blue" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{userProfile.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="text-brainbridge-purple" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{userProfile.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <GraduationCap className="text-green-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Course of Study</p>
                        <p className="font-medium">{userProfile.course}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="text-orange-500" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Join Date</p>
                        <p className="font-medium">{userProfile.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button onClick={handleUpdateProfile} className="w-full sm:w-auto">
                    Update Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
