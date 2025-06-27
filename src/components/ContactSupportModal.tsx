
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Mail, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ContactSupportModalProps {
  trigger?: React.ReactNode;
}

const ContactSupportModal: React.FC<ContactSupportModalProps> = ({ trigger }) => {
  const { profile } = useAuth();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailSubject = encodeURIComponent(`[${category}] ${subject}`);
    const emailBody = encodeURIComponent(`Category: ${category}
Subject: ${subject}

Message:
${message}

---
User Information:
Name: ${profile?.full_name || 'N/A'}
Email: ${profile?.email || 'N/A'}
Phone: ${profile?.phone || 'N/A'}

Please respond to this support request as soon as possible.

Best regards,
${profile?.full_name || 'User'}`);
    
    window.open(`mailto:support@spslabs.com?subject=${emailSubject}&body=${emailBody}`, '_blank');
    
    toast({
      title: "Support Request Sent",
      description: "Your email client has been opened with the support request. Please send the email to complete your request.",
    });
    
    setIsOpen(false);
    setSubject('');
    setCategory('');
    setMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-amber-500 hover:bg-amber-600">
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Support Team
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select support category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="account">Account Management</SelectItem>
                <SelectItem value="billing">Billing Question</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your issue in detail..."
              rows={6}
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 flex-1">
              <Send className="w-4 h-4 mr-2" />
              Send Support Request
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSupportModal;
