import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthorsGrid } from "./sidebar/AuthorsGrid";
import { CategoriesList } from "./sidebar/CategoriesList";
import { SourcesList } from "./sidebar/SourcesList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ContentSidebar = () => {
  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: sources } = useQuery({
    queryKey: ["sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sources")
        .select("*")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authors</CardTitle>
        </CardHeader>
        <CardContent>
          {authors && <AuthorsGrid authors={authors} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categories && <CategoriesList categories={categories} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>External Sources</CardTitle>
        </CardHeader>
        <CardContent>
          {sources && <SourcesList sources={sources} />}
        </CardContent>
      </Card>
    </div>
  );
};