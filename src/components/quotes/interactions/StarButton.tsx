import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";

interface StarButtonProps {
  quoteId: string;
}

export const StarButton = ({ quoteId }: StarButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isStarred, setIsStarred] = useState(false);

  // Fetch stars count
  const { data: starsCount, refetch: refetchStars } = useQuery({
    queryKey: ["quote-stars", quoteId],
    queryFn: async () => {
      const { count } = await supabase
        .from('quote_stars')
        .select('*', { count: 'exact' })
        .eq('quote_id', quoteId);
      return count || 0;
    },
  });

  // Check if user has starred
  useEffect(() => {
    if (user) {
      const checkStarStatus = async () => {
        const { data } = await supabase
          .from('quote_stars')
          .select('id')
          .eq('quote_id', quoteId)
          .eq('user_id', user.id)
          .single();
        
        setIsStarred(!!data);
      };
      
      checkStarStatus();
    }
  }, [quoteId, user]);

  const handleStar = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to star quotes",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isStarred) {
        await supabase
          .from('quote_stars')
          .delete()
          .eq('quote_id', quoteId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('quote_stars')
          .insert({ 
            quote_id: quoteId,
            user_id: user.id 
          });
      }
      
      setIsStarred(!isStarred);
      refetchStars();
      
    } catch (error) {
      console.error('Error toggling star:', error);
      toast({
        title: "Error",
        description: "Failed to update star status",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`text-gray-600 hover:text-[#8B5CF6] ${isStarred ? 'text-[#8B5CF6]' : ''}`}
      onClick={handleStar}
    >
      <Star className="h-4 w-4" />
      {starsCount !== undefined && <span className="ml-1 text-xs">{starsCount}</span>}
    </Button>
  );
};