
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthProvider } from "./useAuthProvider";
import { signInService, signUpService, signOutService, updateProfileService } from "./authService";
import { AuthContextType, UserDetails } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { 
    session, 
    user, 
    userDetails, 
    isLoading, 
    setUserDetails 
  } = useAuthProvider();
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    return await signInService(email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const result = await signUpService(email, password, firstName, lastName);
    if (result.success) {
      navigate("/login");
    }
    return result;
  };

  const signOut = async () => {
    const result = await signOutService();
    if (result.success) {
      navigate("/login");
    }
  };

  const updateProfile = async (profile: Partial<UserDetails>) => {
    if (!user) {
      return { error: new Error("No user logged in"), success: false };
    }

    const result = await updateProfileService(user.id, profile);
    
    if (result.success && userDetails) {
      setUserDetails({ ...userDetails, ...profile });
    }
    
    return result;
  };

  const value = {
    session,
    user,
    userDetails,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
