import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const setPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SetPasswordData = z.infer<typeof setPasswordSchema>;

/**
 * This page handles two flows:
 * 1. New user activation: after ordering, user receives an email invite link
 *    (type=signup or type=invite in URL hash) and sets their password here.
 * 2. Direct navigation: user enters email, receives a magic link, then sets password.
 */
export default function SetPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
        setIsReady(true);
      }
    });

    // Check URL hash for token
    const hash = window.location.hash;
    if (hash.includes('type=signup') || hash.includes('type=invite') || hash.includes('type=recovery') || hash.includes('type=magiclink')) {
      setIsReady(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  // If no token in URL, show email input to send a setup link
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('type=')) {
      setEmailMode(true);
    }
  }, []);

  const form = useForm<SetPasswordData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleSendSetupLink = async () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Check if customer exists
      const { data: customer } = await supabase
        .from('shop_customers')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (!customer) {
        setError('No account found with this email. Please place an order first.');
        setIsLoading(false);
        return;
      }

      // Send activation email via Resend edge function
      const { data, error: fnError } = await supabase.functions.invoke('send-activation-email', {
        body: { email },
      });

      if (fnError) throw fnError;
      if (data && !data.success) throw new Error(data.error || 'Failed to send activation email');

      setEmailSent(true);
      toast.success('Activation link sent! Check your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send activation link');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SetPasswordData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password });
      if (error) throw error;
      setSuccess(true);
      toast.success('Password set successfully! You can now sign in.');
      setTimeout(() => navigate('/shop/register'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to set password');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle2 className="h-16 w-16 mx-auto text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Password Set!</h2>
            <p className="text-muted-foreground">You can now sign in and track your orders.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (emailMode && !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <Card className="w-full max-w-md shadow-2xl border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Activate Your Account</CardTitle>
            <CardDescription>Enter the email you used when ordering to receive a setup link</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {emailSent ? (
              <div className="text-center py-4">
                <Mail className="h-12 w-12 mx-auto text-primary mb-3" />
                <p className="font-medium mb-2">Email Sent!</p>
                <p className="text-sm text-muted-foreground mb-4">Check your inbox for a link to set your password.</p>
                <Link to="/shop/register" className="text-sm text-primary underline">Back to Sign In</Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={handleSendSetupLink} disabled={isLoading}>
                  {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : 'Send Setup Link'}
                </Button>
                <div className="text-center">
                  <Link to="/shop/register" className="text-sm text-muted-foreground hover:underline">Already have a password? Sign In</Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md shadow-2xl border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Set Your Password</CardTitle>
          <CardDescription>Create a password to access your order history and tracking</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Setting password...</> : 'Set Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
