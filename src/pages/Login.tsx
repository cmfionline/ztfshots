import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useQuery } from "@tanstack/react-query";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";
  
  const { data: siteSettings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching site settings:", error);
        return null;
      }
      return data;
    },
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role === "admin" || profile?.role === "superadmin") {
          // If coming from admin route, go there, otherwise go to admin dashboard
          navigate(from.startsWith("/admin") ? from : "/admin");
        } else {
          // Regular users go to profile or original location
          navigate(from);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, from]);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {siteSettings?.logo_url && (
            <div className="flex justify-center">
              <img 
                src={siteSettings.logo_url} 
                alt={siteSettings.site_name || "Site Logo"} 
                className="h-12 w-auto"
              />
            </div>
          )}

          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Sign in
            </h1>
            <p className="text-muted-foreground">
              Access your account to manage quotes and collections
            </p>
          </div>

          <div className="space-y-6">
            <Button 
              variant="outline" 
              className="w-full py-6 flex items-center justify-center gap-3 border-2 hover:bg-muted/50"
              onClick={() => supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/profile`
                }
              })}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  button: {
                    background: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    borderRadius: 'var(--radius)',
                  },
                  anchor: {
                    color: 'hsl(var(--primary))',
                    textDecoration: 'none',
                  },
                  container: {
                    color: 'hsl(var(--foreground))',
                  },
                  label: {
                    color: 'hsl(var(--foreground))',
                  },
                  input: {
                    backgroundColor: 'transparent',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  },
                },
                className: {
                  container: 'space-y-4',
                  button: 'w-full',
                  input: 'bg-background',
                },
              }}
              theme="default"
              providers={[]}
            />
          </div>
        </div>
      </div>

      {/* Right side - Cover Image */}
      <div className="hidden md:block md:w-1/2 relative bg-gradient-to-br from-purple-600 to-indigo-600 overflow-hidden">
        <div 
          className="absolute inset-0 transform -skew-x-12 translate-x-1/4"
          style={{
            backgroundImage: `url(${siteSettings?.cover_image_url || '/placeholder.svg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-indigo-600/80 transform -skew-x-12 translate-x-1/4" />
      </div>
    </div>
  );
};

export default Login;