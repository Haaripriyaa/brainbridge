
import { Session, User } from "@supabase/supabase-js";

export type UserDetails = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

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
