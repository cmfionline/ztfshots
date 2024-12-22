import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useState } from "react";

export type QuoteFilters = {
  search: string;
  authorId: string;
  categoryId: string;
  month: string;
};

export const SearchFilterPanel = () => {
  const [filters, setFilters] = useState<QuoteFilters>({
    search: "",
    authorId: "all",
    categoryId: "all",
    month: "all",
  });

  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("id, name")
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
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="relative col-span-1 lg:col-span-2">
            <Input
              placeholder="Search for a quote or topic..."
              className="pl-10 h-12"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
            <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
          </div>
          
          <Select
            value={filters.authorId}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, authorId: value }))
            }
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select Author" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              {authors?.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.categoryId}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, categoryId: value }))
            }
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.month}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, month: value }))
            }
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {format(new Date(2024, i, 1), "MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};