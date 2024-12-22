import { Navigation } from "@/components/client-portal/Navigation";
import { Footer } from "@/components/client-portal/Footer";
import { UserMenu } from "@/components/layout/UserMenu";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <Navigation />
          <UserMenu />
        </div>
      </div>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};