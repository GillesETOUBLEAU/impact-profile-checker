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
  const { signIn, signUp, logout, session } = useSupabaseAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;
      toast.success('Logged in successfully');
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await signUp({ email, password });
      if (error) throw error;
      toast.success('Sign up successful. Please check your email for verification.');
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return (
      <div className="space-y-4">
        <p>Logged in as: {session.user.email}</p>
        <Button onClick={handleLogout} disabled={loading}>
          {loading ? 'Loading...' : 'Log Out'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleLogin} className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex space-x-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Sign In'}
          </Button>
          <Button type="button" onClick={handleSignUp} disabled={loading} variant="outline">
            {loading ? 'Loading...' : 'Sign Up'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
