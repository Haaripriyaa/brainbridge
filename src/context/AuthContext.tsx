
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getOrCreateUserProgress } from "@/services/progressService";

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
        // Also fetch user progress to update localStorage with IQ test and course selection data
        await getOrCreateUserProgress(data.user.id);
        toast.success("Successfully signed in");
        navigate("/dashboard");
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

      // If signup is successful, create user progress and sign in the user
      if (data?.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }

        // Create initial user progress
        await getOrCreateUserProgress(data.user.id);

        // Automatically sign in the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error("Error signing in after registration:", signInError);
          toast.success("Registration successful! Please sign in.");
          navigate("/login");
          return { error: null, success: true };
        }

        // If sign-in succeeded, update local state and navigate to IQ test
        toast.success("Registration successful! Let's start with an IQ test.");
        navigate("/iq-test");
        return { error: null, success: true };
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
      // Clear localStorage items related to user state
      localStorage.removeItem("iqTestCompleted");
      localStorage.removeItem("iqScore");
      localStorage.removeItem("selectedCourse");
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

      // Update local state
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
