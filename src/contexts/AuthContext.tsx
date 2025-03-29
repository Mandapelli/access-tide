
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signOut, getCurrentUser, confirmResetPassword, resetPassword } from 'aws-amplify/auth';
import { useToast } from '@/components/ui/use-toast';

interface User {
  username: string;
  attributes: {
    email?: string;
    phone_number?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  requestOTP: (identifier: string) => Promise<void>;
  verifyOTP: (identifier: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user is already authenticated
    const checkAuthState = async () => {
      try {
        const userData = await getCurrentUser();
        // Convert the response to match our User interface
        const formattedUser = {
          username: userData.username,
          attributes: userData.signInDetails?.loginId 
            ? { email: userData.signInDetails.loginId }
            : {}
        };
        setUser(formattedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Not signed in');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const handleSignIn = async (identifier: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      
      // For sign in with Amplify v6
      const { isSignedIn, nextStep } = await signIn({
        username: identifier,
        password,
      });
      
      if (isSignedIn) {
        // Get the current user details after sign in
        const userData = await getCurrentUser();
        // Convert the response to match our User interface
        const formattedUser = {
          username: userData.username,
          attributes: userData.signInDetails?.loginId 
            ? { email: userData.signInDetails.loginId }
            : {}
        };
        setUser(formattedUser);
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setError('An unknown error occurred');
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const requestOTP = async (identifier: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await resetPassword({ username: identifier });
      toast({
        title: "Code Sent",
        description: "Verification code has been sent to your email/phone",
      });
    } catch (error) {
      console.error('Error requesting OTP:', error);
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setError('An unknown error occurred');
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (identifier: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // For OTP authentication in Cognito with Amplify v6, we need to create a new temporary password
      const newPassword = Math.random().toString(36).slice(2, 10);
      
      // Confirm the reset password with verification code
      await confirmResetPassword({
        username: identifier,
        confirmationCode: code,
        newPassword
      });
      
      // After successful verification, sign in the user with the new password
      const { isSignedIn } = await signIn({
        username: identifier,
        password: newPassword,
      });
      
      if (isSignedIn) {
        // Get the current user details after sign in
        const userData = await getCurrentUser();
        // Convert the response to match our User interface
        const formattedUser = {
          username: userData.username,
          attributes: userData.signInDetails?.loginId 
            ? { email: userData.signInDetails.loginId }
            : {}
        };
        setUser(formattedUser);
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Signed in successfully with verification code!",
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setError('An unknown error occurred');
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      signIn: handleSignIn, 
      requestOTP, 
      verifyOTP, 
      signOut: handleSignOut, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
