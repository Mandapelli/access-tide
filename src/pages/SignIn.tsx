
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { EyeIcon, EyeOffIcon, ArrowLeftIcon, MailIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SignIn = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const { signIn, requestOTP, verifyOTP, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast({
        title: "Error",
        description: "Please enter your email or phone number",
        variant: "destructive",
      });
      return;
    }
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await signIn(identifier, password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleRequestOTP = async () => {
    if (!identifier) {
      toast({
        title: "Error",
        description: "Please enter your email or phone number",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await requestOTP(identifier);
      setShowOtpVerification(true);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast({
        title: "Error",
        description: "Please enter your email or phone number",
        variant: "destructive",
      });
      return;
    }
    if (!otpCode) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await verifyOTP(identifier, otpCode);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleGoBack = () => {
    if (showOtpVerification) {
      setShowOtpVerification(false);
      setOtpCode('');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <img 
            src="/lovable-uploads/91e3347f-f545-499a-9b73-cec5fbc7275c.png" 
            alt="Logo" 
            className="w-12 h-12 mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-lg">
          {!showOtpVerification ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="identifier" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="email@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="bg-secondary text-foreground"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary text-foreground pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-foreground text-background hover:bg-foreground/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="relative my-6">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">OR</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-transparent border-muted-foreground/30 hover:bg-secondary"
                onClick={handleRequestOTP}
                disabled={isLoading}
              >
                <MailIcon className="h-4 w-4" />
                <span>Email sign-in code</span>
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otpCode" className="text-sm font-medium text-foreground">
                  Verification Code
                </label>
                <Input
                  id="otpCode"
                  type="text"
                  placeholder="Enter the code sent to you"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="bg-secondary text-foreground"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-foreground text-background hover:bg-foreground/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </form>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          className="mt-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleGoBack}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Go back</span>
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
