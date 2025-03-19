
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { UserDetails } from "@/types/auth";
import { getOrCreateUserProgress } from "@/services/progressService";

export const useAuthOperations = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>
) => {
  const navigate = useNavigate();

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
        
        // Check if user has completed IQ test and selected a course
        const isIqTestCompleted = localStorage.getItem("iqTestCompleted") === "true";
        const hasSelectedCourse = localStorage.getItem("selectedCourse");
        
        // Determine where to navigate based on user's completion status
        if (!isIqTestCompleted) {
          navigate("/iq-test");
        } else if (!hasSelectedCourse) {
          navigate("/course-selection");
        } else {
          navigate("/dashboard");
        }
        
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

      // After signup, the user will be redirected to the IQ test in the Register component
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
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        return { error: new Error("No user logged in"), success: false };
      }

      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.data.user.id);

      if (error) {
        return { error, success: false };
      }

      // Update local state by fetching the latest profile
      await fetchUserProfile(user.data.user.id);

      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
  };

  return {
    fetchUserProfile,
    signIn,
    signUp,
    signOut,
    updateProfile
  };
};
