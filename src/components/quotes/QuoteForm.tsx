import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { quoteFormSchema, type QuoteFormValues } from "./types";
import { useQuoteSubmit } from "./hooks/useQuoteSubmit";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useLanguages } from "./hooks/useLanguages";
import { FormHeader } from "./form/FormHeader";
import { FormFields } from "./form/FormFields";

interface QuoteFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<QuoteFormValues>;
  mode: 'add' | 'edit';
  quoteId?: string;
}

export function QuoteForm({ onSuccess, initialValues, mode, quoteId }: QuoteFormProps) {
  const { submitQuote } = useQuoteSubmit(mode, quoteId);
  const [primaryLanguage, setPrimaryLanguage] = useState(initialValues?.primary_language || 'en');
  const { data: languages = [] } = useLanguages();

  const { data: authors, error: authorsError } = useQuery({
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

  const { data: categories, error: categoriesError } = useQuery({
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
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      text: initialValues?.text || "",
      author_id: initialValues?.author_id || "",
      category_id: initialValues?.category_id || "",
      source_title: initialValues?.source_title || "",
      source_url: initialValues?.source_url || "",
      post_date: initialValues?.post_date || new Date(),
      title: initialValues?.title || "",
      primary_language: initialValues?.primary_language || "en",
    },
  });

  if (authorsError) throw authorsError;
  if (categoriesError) throw categoriesError;

  async function onSubmit(values: QuoteFormValues) {
    const success = await submitQuote({
      ...values,
      primary_language: primaryLanguage,
    });
    if (success) {
      form.reset();
      onSuccess?.();
    }
  }

  return (
    <ErrorBoundary>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormHeader 
            primaryLanguage={primaryLanguage}
            onLanguageChange={setPrimaryLanguage}
            languages={languages}
          />
          <FormFields 
            form={form}
            authors={authors || []}
            categories={categories || []}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting 
              ? (mode === 'add' ? "Adding..." : "Updating...") 
              : (mode === 'add' ? "Add Quote" : "Update Quote")}
          </Button>
        </form>
      </Form>
    </ErrorBoundary>
  );
}