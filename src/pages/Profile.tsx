
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { User, Mail, GraduationCap, Calendar, Award, ArrowLeft, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getOrCreateUserProgress } from "@/services/progressService";

const Profile = () => {
  const navigate = useNavigate();
  const { user, userDetails } = useAuth();
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    course: "",
    joinDate: "",
    iqScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from Supabase auth and local storage
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        if (user && userDetails) {
          // Get selected course from localStorage
          const selectedCourse = localStorage.getItem("selectedCourse") || "neet";
          const storedIqScore = localStorage.getItem("iqScore");
          
          // Format the created_at date
          const createdAt = user.created_at 
            ? new Date(user.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) 
            : "N/A";
          
          setUserProfile({
            name: `${userDetails.first_name} ${userDetails.last_name}`.trim(),
            email: userDetails.email,
            course: selectedCourse.toUpperCase(),
            joinDate: createdAt,
            iqScore: storedIqScore ? parseInt(storedIqScore) : 105,
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user, userDetails]);

  const handleUpdateProfile = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="icon" 
              leftIcon={<ArrowLeft size={20} />}
              onClick={() => navigate("/dashboard")}
              className="mr-4"
              aria-label="Back to Dashboard"
            />
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
      
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div className="p-6 sm:p-8 md:p-10 space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200"></div>
                  <div className="w-full bg-gray-200 rounded-lg p-4 mt-4 h-24"></div>
                </div>
                <div className="w-full md:w-2/3 space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-4">
                    <div className="h-14 bg-gray-200 rounded-lg"></div>
                    <div className="h-14 bg-gray-200 rounded-lg"></div>
                    <div className="h-14 bg-gray-200 rounded-lg"></div>
                    <div className="h-14 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10 space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brainbridge-purple to-brainbridge-lightpurple flex items-center justify-center text-white text-4xl font-bold mb-4">
                    {userProfile.name.charAt(0)}
                  </div>
                  
                  <div className="w-full bg-purple-50 rounded-lg p-4 mt-4">
                    <h3 className="text-lg font-semibold text-center mb-2">IQ Score</h3>
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-white border-4 border-brainbridge-purple flex items-center justify-center">
                        <span className="text-2xl font-bold text-brainbridge-purple">
                          {userProfile.iqScore}
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
                        <User className="text-brainbridge-purple" size={20} />
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
                        <GraduationCap className="text-purple-600" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Course of Study</p>
                          <p className="font-medium">{userProfile.course}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="text-purple-500" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Join Date</p>
                          <p className="font-medium">{userProfile.joinDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={handleUpdateProfile} 
                      className="w-full sm:w-auto bg-brainbridge-purple hover:bg-brainbridge-lightpurple"
                    >
                      Update Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
