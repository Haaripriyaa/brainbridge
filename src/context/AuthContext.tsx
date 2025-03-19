
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { getOrCreateUserProgress } from "@/services/progressService";
import { AuthContextType, UserDetails } from "@/types/auth";
import { useAuthOperations } from "@/hooks/useAuthOperations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    fetchUserProfile,
    signIn, 
    signUp, 
    signOut, 
    updateProfile 
  } = useAuthOperations(setUser, setUserDetails);

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        // Check for an active session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
          // Also fetch user progress to update localStorage
          await getOrCreateUserProgress(session.user.id);
        }

        // Set up auth state change listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (newSession?.user) {
              await fetchUserProfile(newSession.user.id);
              // Also fetch user progress to update localStorage
              await getOrCreateUserProgress(newSession.user.id);
            } else {
              setUserDetails(null);
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth provider error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

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
