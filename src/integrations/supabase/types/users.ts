export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  status: string;
  notify_new_quotes: boolean;
  notify_weekly_digest: boolean;
  created_at: string;
  updated_at: string;
  role?: string;
  whatsapp_phone?: string | null;
  whatsapp_verified?: boolean | null;
  notify_whatsapp?: boolean | null;
}