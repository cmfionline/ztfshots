import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteNotifications } from "@/components/notifications/QuoteNotifications";
import { useAuth } from "@/providers/AuthProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { Logo } from "./navigation/Logo";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";
import { UserMenu } from "@/components/layout/UserMenu";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { SubscriptionMenu } from "./navigation/SubscriptionMenu";

export const Navigation = () => {
  const { user } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();
  
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

  const { data: unreadNotifications } = useQuery({
    queryKey: ["unread-notifications", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count, error } = await supabase
        .from("email_notifications")
        .select("*", { count: 'exact', head: true })
        .eq("subscriber_id", user.id)
        .eq("status", "sent")
        .gte("sent_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error("Error fetching notifications:", error);
        return 0;
      }
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const isAdmin = profile?.role === "admin" || profile?.role === "superadmin";

  const getTranslatedContent = (field: string) => {
    if (!siteSettings) return "";
    if (currentLanguage === siteSettings.primary_language) {
      return siteSettings[field];
    }
    return siteSettings.translations?.[currentLanguage]?.[field] || siteSettings[field];
  };

  const siteName = getTranslatedContent("site_name");
  const tagLine = getTranslatedContent("tag_line");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto py-2 sm:py-4">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-2">
          {/* Top Row: Logo & Tagline */}
          <div className="flex justify-between relative">
            <div className="flex flex-col gap-1">
              <Logo logoUrl={siteSettings?.logo_url} siteName={siteName} />
              <p className="text-xs sm:text-sm font-['Roboto'] text-muted-foreground line-clamp-2">
                {tagLine}
              </p>
            </div>
            {/* Mobile Menu Button */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <MobileNav isAdmin={isAdmin} />
            </div>
          </div>
          
          {/* Bottom Row: Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              onLanguageChange={setLanguage}
              variant="dropdown"
            />
            <SubscriptionMenu />
            {user && (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications && unreadNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </Badge>
                  )}
                </Button>
                <div className="relative z-[60]">
                  <QuoteNotifications />
                </div>
                <div className="relative z-[60]">
                  <UserMenu />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-8">
              <Logo logoUrl={siteSettings?.logo_url} siteName={siteName} />
              <DesktopNav isAdmin={isAdmin} />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher
                currentLanguage={currentLanguage}
                onLanguageChange={setLanguage}
                variant="dropdown"
              />
              <SubscriptionMenu />
              {user && (
                <>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications && unreadNotifications > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                      >
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                  <div className="relative z-[60]">
                    <QuoteNotifications />
                  </div>
                  <div className="relative z-[60]">
                    <UserMenu />
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Tagline */}
          <p className="text-base font-['Roboto'] text-muted-foreground line-clamp-2">
            {tagLine}
          </p>
        </div>
      </div>
    </header>
  );
};