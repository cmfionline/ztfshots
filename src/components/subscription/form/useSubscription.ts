import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface SubscriptionRequest {
  name: string;
  email: string;
  nation?: string;
  notify_new_quotes?: boolean;
  notify_weekly_digest?: boolean;
  notify_whatsapp?: boolean;
  whatsapp_phone?: string;
  type?: 'email' | 'whatsapp' | 'browser';
}

export const validateSubscriptionRequest = (request: SubscriptionRequest) => {
  if (!request.name || request.name.trim().length === 0) {
    return { isValid: false, error: "Name is required" };
  }

  if (!request.email || request.email.trim().length === 0) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.email)) {
    return { isValid: false, error: "Please provide a valid email address" };
  }

  if (request.type === 'whatsapp' && !request.whatsapp_phone) {
    return { isValid: false, error: "WhatsApp phone number is required for WhatsApp subscriptions" };
  }

  return { isValid: true, error: null };
};

export const useSubscription = (type: 'email' | 'whatsapp' | 'browser' = 'email') => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nation, setNation] = useState("");
  const [notifyNewQuotes, setNotifyNewQuotes] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const subscriptionData: SubscriptionRequest = {
        name,
        email,
        nation,
        notify_new_quotes: type === 'email' ? notifyNewQuotes : false,
        notify_weekly_digest: type === 'email' ? notifyWeeklyDigest : false,
        notify_whatsapp: type === 'whatsapp' ? notifyWhatsapp : false,
        whatsapp_phone: type === 'whatsapp' ? whatsappPhone : null,
        type
      };

      const validationResult = validateSubscriptionRequest(subscriptionData);
      if (!validationResult.isValid) {
        throw new Error(validationResult.error);
      }

      const { data, error: subscribeError } = await supabase.functions.invoke('subscribe', {
        body: subscriptionData
      });

      if (subscribeError) {
        throw subscribeError;
      }

      setIsSuccess(true);
      toast({
        title: "Subscription Successful!",
        description: `Thank you for subscribing to our ${type} updates!`,
      });
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Failed to process your subscription. Please try again.');
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: err.message || "There was an error processing your subscription. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    email,
    nation,
    notifyNewQuotes,
    notifyWeeklyDigest,
    notifyWhatsapp,
    whatsappPhone,
    isLoading,
    isSuccess,
    error,
    setName,
    setEmail,
    setNation,
    setNotifyNewQuotes,
    setNotifyWeeklyDigest,
    setNotifyWhatsapp,
    setWhatsappPhone,
    handleSubmit,
  };
};