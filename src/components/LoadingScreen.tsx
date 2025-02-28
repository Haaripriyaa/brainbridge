
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          transition: {
            duration: 0.5,
            ease: "easeInOut"
          }
        }}
        className="flex flex-col items-center"
      >
        <div className="relative w-20 h-20 mb-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute inset-0 bg-brainbridge-blue rounded-full blur-xl opacity-50"
          />
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
          >
            <motion.path
              d="M25,50 a25,25 0 1,1 50,0 a25,25 0 1,1 -50,0"
              fill="none"
              strokeWidth="5"
              stroke="currentColor"
              strokeLinecap="round"
              className="text-brainbridge-blue"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </svg>
        </div>
        <motion.h2 
          className="text-xl font-medium text-foreground animate-pulse"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          Loading BrainBridge
        </motion.h2>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
