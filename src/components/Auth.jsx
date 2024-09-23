import React, { useState } from 'react';
import { useSupabaseAuth } from '../integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useSupabaseAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'Invalid login credentials') {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('failed to call url')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(error.message || 'An error occurred during login');
      }
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleLogin} className="space-y-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};

export default Auth;
