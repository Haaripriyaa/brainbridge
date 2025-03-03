
import { supabase } from "@/integrations/supabase/client";

export interface UserProgress {
  id?: string;
  user_id: string;
  total_courses: number;
  completed_courses: number;
  average_score: number;
  study_hours: number;
}

export const getOrCreateUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    // First, try to get existing progress
    const { data: existingProgress, error: fetchError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user progress:', fetchError);
      return null;
    }

    // If progress exists, return it
    if (existingProgress) {
      return existingProgress as UserProgress;
    }

    // If no progress exists, create a new one with default values
    const defaultProgress: UserProgress = {
      user_id: userId,
      total_courses: 20,
      completed_courses: 0,
      average_score: 0,
      study_hours: 0
    };

    const { data: newProgress, error: insertError } = await supabase
      .from('user_progress')
      .insert(defaultProgress)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user progress:', insertError);
      return null;
    }

    return newProgress as UserProgress;
  } catch (error) {
    console.error('Unexpected error in getOrCreateUserProgress:', error);
    return null;
  }
};

export const updateUserProgress = async (
  userId: string, 
  updates: Partial<UserProgress>
): Promise<UserProgress | null> => {
  try {
    // Get the existing progress to update
    const { data: existingProgress, error: fetchError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching user progress for update:', fetchError);
      return null;
    }

    // If no progress exists, create a new one with provided updates
    if (!existingProgress) {
      return getOrCreateUserProgress(userId);
    }

    // Update the progress
    const { data: updatedProgress, error: updateError } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user progress:', updateError);
      return null;
    }

    return updatedProgress as UserProgress;
  } catch (error) {
    console.error('Unexpected error in updateUserProgress:', error);
    return null;
  }
};
