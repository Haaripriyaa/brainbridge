
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 800);
  };

  const handleSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/register");
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
      <motion.div 
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-10"
          >
            <Logo size="lg" />
          </motion.div>

          <motion.div variants={itemVariants} className="w-full mb-4">
            <Button 
              variant="primary" 
              fullWidth 
              size="lg"
              onClick={handleLogin}
              isLoading={isLoading}
              className="mb-3"
            >
              Log In
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <Button 
              variant="outline" 
              fullWidth 
              size="lg"
              onClick={handleSignUp}
              isLoading={isLoading}
            >
              Sign Up
            </Button>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="mt-8 text-xs text-center text-gray-500"
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
