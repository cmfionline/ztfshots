import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "@/integrations/supabase/types/users";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DOMPurify from "dompurify";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import countries from "world-countries";

// Prepare countries data outside component
const sortedCountries = countries
  .map(country => ({
    label: country.name.common,
    value: country.name.common
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

interface EditSubscriberDialogProps {
  subscriber: User | null;
  onClose: () => void;
  onSubmit: (data: {
    id: string;
    name: string;
    email: string;
    nation: string | null;
    notify_new_quotes: boolean;
    notify_weekly_digest: boolean;
  }) => void;
}

export function EditSubscriberDialog({ subscriber, onClose, onSubmit }: EditSubscriberDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nation: "",
    notify_new_quotes: false,
    notify_weekly_digest: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (subscriber) {
      setFormData({
        name: DOMPurify.sanitize(subscriber.name),
        email: DOMPurify.sanitize(subscriber.email),
        nation: subscriber.nation || "",
        notify_new_quotes: subscriber.notify_new_quotes || false,
        notify_weekly_digest: subscriber.notify_weekly_digest || false,
      });
    }
  }, [subscriber]);

  if (!subscriber) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      id: subscriber.id,
      ...formData,
      nation: formData.nation || null,
    });
  };

  return (
    <Dialog open={!!subscriber} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subscriber</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Nation</Label>
              <Select 
                value={formData.nation} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, nation: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country..." />
                </SelectTrigger>
                <SelectContent>
                  {sortedCountries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notify_new_quotes">Notify about new quotes</Label>
                <Switch
                  id="notify_new_quotes"
                  name="notify_new_quotes"
                  checked={formData.notify_new_quotes}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notify_new_quotes: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify_weekly_digest">Receive weekly digest</Label>
                <Switch
                  id="notify_weekly_digest"
                  name="notify_weekly_digest"
                  checked={formData.notify_weekly_digest}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notify_weekly_digest: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}