
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-foreground mb-4">Welcome!</h1>
        <p className="text-foreground mb-2">You are logged in as:</p>
        <p className="text-primary mb-6">{user?.attributes?.email || user?.attributes?.phone_number || user?.username}</p>
        
        <Button 
          className="w-full bg-foreground text-background hover:bg-foreground/90"
          onClick={signOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
