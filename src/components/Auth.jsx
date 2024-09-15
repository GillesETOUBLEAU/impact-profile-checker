import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';
import { assignUserRole } from '../utils/supabaseUtils';

const Auth = ({ onAuthStateChange }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (onAuthStateChange) {
        onAuthStateChange(event, session);
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [onAuthStateChange]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('Attempting login with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
      });
      
      if (error) throw error;
      
      console.log('Login response:', data);
      if (data.user) {
        console.log('User logged in successfully:', data.user);
        toast.success('Logged in successfully');
        // Check if the user has an admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
        
        if (roleError) {
          console.error('Error fetching user role:', roleError);
        } else if (roleData && roleData.role === 'admin') {
          console.log('User has admin role');
        } else {
          console.log('User does not have admin role');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'Invalid login credentials') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(error.message || 'An error occurred during login');
      }
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
      console.log('Attempting signup with email:', email);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
      });
      
      if (error) throw error;
      
      console.log('Signup response:', data);
      if (data.user) {
        console.log('User signed up successfully:', data.user);
        // Assign a default role to the new user
        await assignUserRole(data.user.id, 'admin');
        toast.success('Signed up successfully. Please check your email for verification.');
      } else {
        setError('Sign up failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'An error occurred during sign up');
      toast.error(error.message || 'Sign up failed');
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
        <div className="space-x-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Sign In'}
          </Button>
          <Button type="button" onClick={handleSignUp} disabled={loading}>
            {loading ? 'Loading...' : 'Sign Up'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
