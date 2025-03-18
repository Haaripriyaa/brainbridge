
import { supabase } from "@/integrations/supabase/client";
import { UserDetails } from "./types";
import { toast } from "sonner";

export const signInService = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error, success: false };
    }

    if (data?.user) {
      // Fetch user progress data
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (progressData) {
        if (progressData.iq_score !== null && progressData.iq_score !== undefined) {
          localStorage.setItem("iqScore", progressData.iq_score.toString());
          localStorage.setItem("iqTestCompleted", "true");
        }

        if (progressData.selected_course) {
          localStorage.setItem("selectedCourse", progressData.selected_course);
        }
      }

      toast.success("Successfully signed in");
      return { error: null, success: true };
    }

    return { error: new Error("No user data returned"), success: false };
  } catch (error) {
    console.error("Sign in error:", error);
    return { error, success: false };
  }
};

export const signUpService = async (
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
    return { error: null, success: true };
  } catch (error) {
    return { error, success: false };
  }
};

export const signOutService = async () => {
  try {
    await supabase.auth.signOut();
    toast.success("Successfully signed out");
    return { error: null, success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error("Error signing out");
    return { error, success: false };
  }
};

export const updateProfileService = async (userId: string, profile: Partial<UserDetails>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId);

    if (error) {
      return { error, success: false };
    }

    return { error: null, success: true };
  } catch (error) {
    return { error, success: false };
  }
};
