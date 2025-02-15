import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { format } from "date-fns";
import { HeroSectionSkeleton } from "./skeletons/HeroSectionSkeleton";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  const { data: featuredQuote, isLoading } = useQuery({
    queryKey: ["featured-quote"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name, image_url),
          categories:category_id(name),
          sources:source_id(title)
        `)
        .eq("status", "live")
        .order("post_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <HeroSectionSkeleton />;
  }

  return (
    <div className="relative bg-gradient-to-br from-[#EDF4FF] to-white border-b">
      <div className="container mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        {featuredQuote && (
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-[#2B4C7E] font-['Open_Sans'] mb-2">
              Quote of the Day
            </h1>
            <div className="max-w-3xl mx-auto">
              <QuoteCard
                id={featuredQuote.id}
                quote={featuredQuote.text}
                author={featuredQuote.authors?.name || "Unknown"}
                authorImageUrl={featuredQuote.authors?.image_url}
                category={featuredQuote.categories?.name || "Uncategorized"}
                date={format(new Date(featuredQuote.created_at), "MMMM d, yyyy")}
                sourceTitle={featuredQuote.source_title}
                sourceUrl={featuredQuote.source_url}
                translations={featuredQuote.translations as Record<string, any> || {}}
                primaryLanguage={featuredQuote.primary_language}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 px-4 sm:px-0">
              <Button 
                size="lg" 
                className="bg-[#33A1DE] hover:bg-[#2B4C7E] w-full sm:w-auto transition-colors"
                onClick={() => navigate("/quotes")}
              >
                Explore Quotes
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-[#33A1DE] text-[#33A1DE] hover:bg-[#33A1DE]/10"
                onClick={() => navigate("/subscribe")}
              >
                Subscribe
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};