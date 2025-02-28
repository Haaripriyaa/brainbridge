
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-9xl font-bold text-gray-200"
          >
            404
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Page not found</h1>
          <p className="text-gray-500 mt-2">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <Button
            variant="primary"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft size={16} />}
          >
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
