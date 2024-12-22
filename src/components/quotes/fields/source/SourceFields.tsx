import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSourcesQuery } from "./useSourcesQuery";
import type { SourceFieldsProps } from "./types";

export function SourceFields({ control, setValue }: SourceFieldsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: sources, isLoading } = useSourcesQuery();

  const handleSourceSelect = (title: string, url?: string) => {
    setValue("source_title", title, { 
      shouldValidate: true,
      shouldDirty: true 
    });
    setValue("source_url", url || "", {
      shouldValidate: true,
      shouldDirty: true
    });
    setShowSuggestions(false);
  };

  return (
    <>
      <FormField
        control={control}
        name="source_title"
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>Source Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., The Art of War" 
                {...field} 
                value={field.value || ''} 
                onFocus={() => setShowSuggestions(true)}
              />
            </FormControl>
            <FormDescription>
              Select an existing source or enter a new one
            </FormDescription>
            {showSuggestions && sources && sources.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
                <ScrollArea className="h-[200px]">
                  <div className="p-2">
                    {sources.map((source) => (
                      <button
                        key={source.id}
                        className="w-full text-left px-2 py-1.5 hover:bg-accent rounded-sm text-sm"
                        onClick={() => handleSourceSelect(source.title, source.url)}
                        type="button"
                      >
                        {source.title}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="source_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source URL (optional)</FormLabel>
            <FormControl>
              <Input 
                type="url" 
                placeholder="https://example.com/book" 
                {...field} 
                value={field.value || ''} 
              />
            </FormControl>
            <FormDescription>
              The URL where this quote can be found (must start with http:// or https://)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}