import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { toast } from "sonner";
import { ArrowLeft, User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "haripriya.komadurai@gmail.com",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      agreeToTerms?: string;
    } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-100 to-purple-50">
      <motion.div 
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow-sm relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button 
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </button>

        <div className="flex flex-col items-center mb-8 mt-4">
          <Logo size="sm" showText={true} />
          <h2 className="text-2xl font-bold text-gray-800 mb-1 mt-4">Welcome!</h2>
          <p className="text-sm text-gray-500">Sign up for the BrainBridge</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="First name"
            name="firstName"
            type="text"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            leftIcon={<User size={16} />}
            showClearButton
            onClear={() => setFormData(prev => ({ ...prev, firstName: "" }))}
          />

          <Input
            label="Last name"
            name="lastName"
            type="text"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            leftIcon={<User size={16} />}
            showClearButton
            onClear={() => setFormData(prev => ({ ...prev, lastName: "" }))}
          />

          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            leftIcon={<Mail size={16} />}
            showClearButton
            onClear={() => setFormData(prev => ({ ...prev, email: "" }))}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            leftIcon={<Lock size={16} />}
          />

          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            leftIcon={<Lock size={16} />}
          />

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-brainbridge-purple focus:ring-brainbridge-purple border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-600">
                By clicking on "sign up", you're agreeing to the BrainBridge App{" "}
                <a href="#" className="text-brainbridge-purple hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-brainbridge-purple hover:underline">Privacy Policy</a>.
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1.5 text-sm text-red-500">{errors.agreeToTerms}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="bg-brainbridge-purple hover:bg-brainbridge-lightpurple"
          >
            Sign Up
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a onClick={() => navigate('/login')} className="font-medium text-brainbridge-purple hover:text-purple-700 cursor-pointer">
              Log in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
