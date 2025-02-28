
import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  // Size mapping
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const textSizeMap = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${sizeMap[size]} relative mb-3`}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Book */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            d="M20 75 V30 C20 25 22 20 30 20 H70 C78 20 80 25 80 30 V75"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-brainbridge-blue"
            fill="none"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            d="M20 75 C20 70 22 65 30 65 H70 C78 65 80 70 80 75"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-brainbridge-blue"
            fill="none"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
            d="M50 20 V65"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-brainbridge-blue"
            fill="none"
          />
          
          {/* Brain */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 2.5 }}
            d="M40 35 C35 32 35 25 40 22 C45 19 50 22 50 25 C50 22 55 19 60 22 C65 25 65 32 60 35 C65 38 65 45 60 48 C55 51 50 48 50 45 C50 48 45 51 40 48 C35 45 35 38 40 35Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-brainbridge-purple"
            fill="none"
          />
          
          {/* Rays/Lines from brain */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 4 }}
          >
            <motion.line x1="35" y1="30" x2="30" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-brainbridge-purple" />
            <motion.line x1="45" y1="20" x2="45" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-brainbridge-purple" />
            <motion.line x1="55" y1="20" x2="55" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-brainbridge-purple" />
            <motion.line x1="65" y1="30" x2="70" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-brainbridge-purple" />
            <motion.line x1="65" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-brainbridge-purple" />
          </motion.g>
        </svg>
      </motion.div>
      
      {showText && (
        <motion.div 
          className="flex flex-col items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className={`font-bold ${textSizeMap[size]} text-brainbridge-navy`}>
            BrainBridge
          </h1>
          <p className="text-xs text-center mt-1 text-gray-600">
            GenAI meets scholastic excellence
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Logo;
