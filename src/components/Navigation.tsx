
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import {
  Brain,
  BookOpen,
  MessageSquare,
  ListChecks,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface NavLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const links: NavLink[] = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <Brain size={20} />,
    },
    {
      label: "Quiz",
      path: "/quiz",
      icon: <BookOpen size={20} />,
    },
    {
      label: "ChatBot",
      path: "/chatbot",
      icon: <MessageSquare size={20} />,
    },
    {
      label: "To-Do List",
      path: "/todo",
      icon: <ListChecks size={20} />,
    },
    {
      label: "Forum",
      path: "/forum",
      icon: <Users size={20} />,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  // Don't show navigation on pages that need full screen and back button
  const fullScreenPages = ['/chatbot', '/forum', '/profile', '/todo'];
  if (fullScreenPages.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16",
          isScrolled || isMobileMenuOpen
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4 cursor-pointer pt-2" onClick={() => navigate("/dashboard")}>
              <Logo size="sm" showText={true} />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <a
                key={link.path}
                onClick={() => navigate(link.path)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                  location.pathname === link.path
                    ? "text-brainbridge-purple bg-purple-50"
                    : "text-gray-600 hover:text-brainbridge-purple hover:bg-purple-50/50"
                )}
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {userDetails && (
              <div className="flex items-center mr-2">
                <span className="text-sm font-medium text-gray-700">
                  {userDetails.first_name}
                </span>
              </div>
            )}
            <div
              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => navigate("/profile")}
            >
              <User size={20} className="text-gray-600" />
            </div>
            <div
              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={20} className="text-gray-600" />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-white md:hidden"
          >
            <div className="p-4 space-y-2">
              {userDetails && (
                <div className="flex items-center p-4 border-b border-gray-100 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-medium">{userDetails.first_name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{userDetails.first_name} {userDetails.last_name}</p>
                    <p className="text-sm text-gray-500">{userDetails.email}</p>
                  </div>
                </div>
              )}
              
              {links.map((link) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    onClick={() => {
                      navigate(link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer",
                      location.pathname === link.path
                        ? "text-brainbridge-purple bg-purple-50"
                        : "text-gray-600"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {link.icon}
                      <span className="font-medium">{link.label}</span>
                    </div>
                    <ChevronRight
                      size={18}
                      className={
                        location.pathname === link.path
                          ? "text-brainbridge-purple"
                          : "text-gray-400"
                      }
                    />
                  </a>
                </motion.div>
              ))}

              <div className="pt-4 border-t mt-4">
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2, delay: 0.4 }}
                >
                  <a
                    onClick={() => {
                      navigate("/profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer",
                      location.pathname === "/profile"
                        ? "text-brainbridge-purple bg-purple-50"
                        : "text-gray-600"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <User size={20} />
                      <span className="font-medium">Profile</span>
                    </div>
                    <ChevronRight
                      size={18}
                      className={
                        location.pathname === "/profile"
                          ? "text-brainbridge-purple"
                          : "text-gray-400"
                      }
                    />
                  </a>
                </motion.div>

                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2, delay: 0.5 }}
                >
                  <a
                    onClick={handleLogout}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut size={20} />
                      <span className="font-medium">Logout</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
