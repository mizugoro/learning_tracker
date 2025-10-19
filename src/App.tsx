import { useState, useEffect } from "react";
import { AuthForm } from "./components/AuthForm";
import { Dashboard } from "./components/Dashboard";
import { supabase } from "./utils/supabase/client";

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session && !error) {
        setAccessToken(session.access_token);
      }
    } catch (error) {
      console.error("Session check error:", error);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setAccessToken(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return <AuthForm onAuthSuccess={setAccessToken} />;
  }

  return <Dashboard accessToken={accessToken} onLogout={handleLogout} />;
}
