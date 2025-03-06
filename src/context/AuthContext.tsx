import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    success: boolean;
  }>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{
    error: any | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserDetails>) => Promise<{
    error: any | null;
    success: boolean;
  }>;
};

export type UserDetails = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }

        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (newSession?.user) {
              await fetchUserProfile(newSession.user.id);
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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setUserDetails({
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error, success: false };
      }

      if (data?.user) {
        await fetchUserProfile(data.user.id);

        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (progressData && progressData.iq_score) {
          localStorage.setItem("iqScore", progressData.iq_score.toString());
          localStorage.setItem("iqTestCompleted", "true");
        }

        if (progressData && progressData.selected_course) {
          localStorage.setItem("selectedCourse", progressData.selected_course);
        }

        toast.success("Successfully signed in");
        return { error: null, success: true };
      }

      return { error: new Error("No user data returned"), success: false };
    } catch (error) {
      return { error, success: false };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        return { error, success: false };
      }

      toast.success("Registration successful! Please sign in.");
      navigate("/login");
      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const updateProfile = async (profile: Partial<UserDetails>) => {
    try {
      if (!user) {
        return { error: new Error("No user logged in"), success: false };
      }

      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) {
        return { error, success: false };
      }

      if (userDetails) {
        setUserDetails({ ...userDetails, ...profile });
      }

      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
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
